import Prometheus from "prom-client";
import { METRIC_PREFIX } from "./prometheus";

const MetricCounter = (config: Prometheus.CounterConfiguration<string>) => {
    const {name, ...restConfig} = config;
    return new Prometheus.Counter({
    name: `${METRIC_PREFIX}${name}`,
    ...restConfig
})};

export const numberOfRequestCounter = MetricCounter({
    name: 'count_requests_total',
    help: '<COUNTER>: counts number of received requests',   
});


export default MetricCounter;
