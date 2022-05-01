import express from "express";
import Prometheus from 'prom-client';

const promMiddleware = express();

export const METRIC_PREFIX = 'server_';

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({
    prefix: METRIC_PREFIX
});

promMiddleware.get("/metrics", async (_, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end( await Prometheus.register.metrics());
});

export default promMiddleware;