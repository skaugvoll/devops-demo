import apm from "elastic-apm-node";
import express from "express";
import cors from "cors";
import { numberOfRequestCounter } from "./middleware/prometheus/counters";
import { requestDuration } from "./middleware/prometheus/histogram";
import prometheus from "./middleware/prometheus/prometheus";
import apmAgentStart from "./utils/apmAgent";
import { waitFor } from "./utils/waitFor";

// Needs to be the first thing in this file
apmAgentStart();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost'

const appRouter = express.Router();

// Add CORS
app.use(cors());

// Add promethus setup & config as middleware,
app.use(prometheus)

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


// add route to simulate processing
appRouter.get('/delay/:sec', async (req, res) => {
    const { sec } = req.params;
    const ms_unit = 1000;
    try {
        console.log('Waiting for...');
        await waitFor(Number(sec) * ms_unit);
        console.log('Done waiting returning 200');
        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(500);
    }
})



// add index route;
// appRouter.get('/', (req, res) => {
//     res.send(app._router.stack);
// })
app.use("/", appRouter);

// start application
app.listen(PORT, HOST, () => {
    console.log(`Server started @ ${HOST}:${PORT}`)
})