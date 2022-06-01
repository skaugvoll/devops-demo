import express from "express";
import Prometheus from 'prom-client';
import os from "os-utils"
const promMiddleware = express();

export const METRIC_PREFIX = 'backend_two_';
// --------------- CUSTOM COLLECTORS ------------
const memUsage = new Prometheus.Gauge({
    name: METRIC_PREFIX + 'memory_usage',
    help: "% of used memory [0,1]",
    collect() {
        this.set(1 - os.freememPercentage())
    }
});

const cpuUsage = new Prometheus.Gauge({
    name: METRIC_PREFIX + 'cpu_usage',
    help: "% of used memory [0,1]",
    collect() {
        os.cpuUsage((value) => this.set(value))
    }
})

// --------------- CUSTOM COLLECTORS ------------



const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
export const registry = new Prometheus.Registry()
registry.registerMetric(memUsage)
registry.registerMetric(cpuUsage)

collectDefaultMetrics({
    prefix: METRIC_PREFIX,
    register: registry
});


promMiddleware.get("/metrics", async (_, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
});

export default promMiddleware;