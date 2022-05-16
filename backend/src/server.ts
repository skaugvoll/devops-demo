import apmAgentStart, { getAgent } from "./utils/apmAgent";
// Needs to be the first thing in this file
const agent = apmAgentStart();

import express from "express";
import cors from "cors";
import { numberOfRequestCounter } from "./middleware/prometheus/counters";
import { requestDuration } from "./middleware/prometheus/histogram";
import prometheus from "./middleware/prometheus/prometheus";
import { waitFor } from "./utils/waitFor";
import axios from "axios";
import morgan from "morgan";
import Logger from "./utils/logger";
import { logger } from "elastic-apm-node";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0'

export const createAPMTraceLogFormat = (ids: typeof agent.currentTraceIds) => {
    return `| transaction.id = ${ids["transaction.id"]} trace.id = ${ids["trace.id"]} span.id = ${ids["span.id"] ?? 'None'} |`
}

morgan.token('corrlealationLog', () => {
    const logCorrelationIds = agent.currentTraceIds;
    return createAPMTraceLogFormat(logCorrelationIds);
})

app.use(
    morgan(
        ':method :url :status :res[content-length] :corrlealationLog :response-time ms'
    )
)

const appRouter = express.Router();

// Add CORS
appRouter.use(cors(
    {
        origin: '*',
        allowedHeaders: ['traceparent', "Access-Control-Request-Method", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"]

    }
));

// app.use(cors());

// Add promethus setup & config as middleware,
appRouter.use(prometheus)

// count all incomming requests, before handing of to target route
appRouter.all('*', async (req, res, next) => {
    // increment number of requests metric   
    numberOfRequestCounter.inc();
    const startOperation = new Date();

    // add user context to APM
    agent.setUserContext({
        id: 1,
        username: "test",
        email: 'test@testersen.no'
    })


    // add afterware on all requests
    res.on('finish', () => {
        const endOperation = new Date().getSeconds() - startOperation.getSeconds();
        // observe route timeing
        const statusLabel = res.statusCode;
        const methodLabel = req.method
        requestDuration.labels(`${statusLabel}`, `${methodLabel}`).observe(endOperation)
    })
    // execute target/route handler
    next();

})


appRouter.get("/", (req, res) => {
    var route, routes: Record<any, any>[] = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) { // routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === 'router') { // router middleware 
            middleware.handle.stack.forEach(function (handler) {
                route = handler.route;
                route && routes.push(route);
            });
        }
    });
    console.log("<server 1>: returning /")
    res.json(routes);
})


// add route to simulate processing
appRouter.get('/delay/:sec', async (req, res) => {
    const { sec } = req.params;
    const ms_unit = 1000;
    try {
        Logger.info('Waiting for...');
        await waitFor(Number(sec) * ms_unit);
        Logger.info('Done waiting returning 200');
        Logger.info("<server 1>: returning /delay:sec")
        res.sendStatus(200);
    }
    catch (e) {
        Logger.error("<server 1>: returning error on /delay/:sec")
        res.sendStatus(500);
    }
})

appRouter.get('/data', async (req, res) => {
    Logger.info("Server 1 <data>: hey there");
    const apmAgent = getAgent();
    try {
        const r = await axios.get('http://backendtwo:3000/data') // use container port, not exposed on host
        const d = r.data;
        Logger.info(`<server 1>: returning /data`)
        res.send(d);
    } catch (e) {
        Logger.error("<server 1> ERROR: ", JSON.stringify(e, null, 2))
        agent.captureError(e, {
            custom: {
                type: 'request',
                src: 'backend_1',
                dest: 'backend_2'
            }
        })
        res.sendStatus(500);
    }
})

appRouter.get('/data-error', async (req, res) => {
    try {
        // return await axios.get('http://backentwo:3000/data-error'); // use continer port, not exposed on host
        const r = await axios.get('http://backendtwo:3000/data-error'); // use continer port, not exposed on host
        const d = r.data;
        Logger.info("<server 1> : this should never happen");
        // res.send(d);
        return r;
    } catch (e) {
        Logger.warn("<server 1> /data-error catch clause because backendtwo failed, as expected")
        agent.captureError(e, {
            custom: {
                type: 'request',
                src: 'Backend_1',
                dest: 'Backend_2',
                msg: 'Backend_2 Failed, so this endpnt returns error, and is marked as faulty'
            }
        },
            () => res.sendStatus(200)
        )

    }
})

app.use("/", appRouter);

// start application
app.listen(PORT, '0.0.0.0', () => {
    Logger.http(`Server started @${HOST}:${PORT} `)
})