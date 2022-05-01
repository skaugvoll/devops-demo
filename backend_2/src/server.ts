import apmAgentStart from "./utils/apmAgent";
// Needs to be the first thing in this file
const agent = apmAgentStart();

import express from "express";
import cors from "cors";
import { numberOfRequestCounter } from "./middleware/prometheus/counters";
import { requestDuration } from "./middleware/prometheus/histogram";
import prometheus from "./middleware/prometheus/prometheus";
import morgan from "morgan";


const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0'

morgan.token('corrlealationLog', () => {
    const logCorrelationIds = agent.currentTraceIds;
    return `| transaction.id = ${logCorrelationIds["transaction.id"]} trace.id = ${logCorrelationIds["trace.id"]} span.id = ${logCorrelationIds["span.id"] ?? 'None'} |`
})

const appRouter = express.Router();

// Add CORS
appRouter.use(cors(
    {
        origin: '*',
        allowedHeaders: ['traceparent', "Access-Control-Request-Method", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"]
    }
));

app.use(
    morgan(
        ':method :url :status :res[content-length] :corrlealationLog :response-time ms'
    )
)

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
        console.log('observing request duration: ', endOperation);
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

    res.json(routes);
})

appRouter.get('/data', (req, res) => {

    const data = [{
        firstName: 'Test',
        lastName: 'Testersen'
    },
    {
        firstName: 'Mr/s',
        lastName: 'Manager'
    }]
    return res.send(data);
})

appRouter.get('/data-error', (req, res) => {
    console.error("Server 2, this messages should appear, as this endpoint failes every time!")
    return Error('Could not return any data');
})

app.use("/", appRouter);

// start application
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started @ ${HOST}:${PORT}`)
})