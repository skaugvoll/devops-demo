import Prometheus from "prom-client";
import { METRIC_PREFIX, registry } from "./prometheus";


const MetricHistgram = <L extends string>(config: Prometheus.HistogramConfiguration<L>) => {
    const { name, ...restConfig } = config;
    const metric = new Prometheus.Histogram({
        name: `${METRIC_PREFIX}${name}`,
        ...restConfig
    })
    registry.registerMetric(metric);
    return metric;
};

type RequestDurationLabels = 'status' | 'method';
export const requestDuration = MetricHistgram<RequestDurationLabels>({
    name: 'requests_duration_histogram',
    help: '<HISTOGRAM>: observe request execution duration, Seconds',
    buckets: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    // route as label is a bad thing, as it is not a finite number of values
    // thus, it creates a new histogram, for each new route
    // but if your app has low finite number of different urls, it's ok 
    labelNames: ['status', 'method']
})

export default MetricHistgram;