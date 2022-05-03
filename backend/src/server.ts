import apmAgentStart from "./utils/apmAgent";
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

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0'

morgan.token('corrlealationLog', () => {
    const logCorrelationIds = agent.currentTraceIds;
    return `| transaction.id = ${logCorrelationIds["transaction.id"]} trace.id = ${logCorrelationIds["trace.id"]} span.id = ${logCorrelationIds["span.id"] ?? 'None'} |`
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
        console.log('Waiting for...');
        await waitFor(Number(sec) * ms_unit);
        console.log('Done waiting returning 200');
        console.log("<server 1>: returning /delay:sec")
        res.sendStatus(200);
    }
    catch (e) {
        console.error("<server 1>: returning error on /delay/:sec")
        res.sendStatus(500);
    }
})

appRouter.get('/data', async (req, res) => {
    console.log("Server 1 <data>: hey there");
    try {
        const r = await axios.get('http://backendtwo:3000/data') // use container port, not exposed on host
        const d = r.data;
        console.log("<server 1>: returning /data")
        res.send(d);
    } catch (e) {
        console.error("<server 1> ERROR: ", JSON.stringify(e, null, 2), e)
        res.sendStatus(500);
    }
})

appRouter.get('/data-error', async (req, res) => {
    try {
        const r = await axios.get('http://backentwo:3000/data-error'); // use continer port, not exposed on host
        const d = r.data;
        console.log("<server 1> : this should never happen");
        res.send(d);
    } catch (e) {
        console.warn("<server 1> return status 400, fetching from backendtwo")
        res.sendStatus(400);
    }
})

app.use("/", appRouter);

// start application
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started @ ${HOST}:${PORT}`)
})