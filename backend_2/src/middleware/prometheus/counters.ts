import Prometheus from "prom-client";
import { METRIC_PREFIX, registry } from "./prometheus";

const MetricCounter = (config: Prometheus.CounterConfiguration<string>) => {
    const { name, ...restConfig } = config;
    const metric = new Prometheus.Counter({
        name: `${METRIC_PREFIX}${name}`,
        ...restConfig
    })
    registry.registerMetric(metric);
    return metric;
};

export const numberOfRequestCounter = MetricCounter({
    name: 'count_requests_total',
    help: '<COUNTER>: counts number of received requests',
});

export const numberOfFailedRequestCounter = MetricCounter({
    name: 'count_failed_requests_total',
    help: '<COUNTER>: counts number of received requests',
    labelNames: ['status']
});

export default MetricCounter;
