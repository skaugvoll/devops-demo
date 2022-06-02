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
    buckets: Prometheus.exponentialBuckets(0.1, 2, 10), // # [0.1,0.2,0.4,0.8,1.6,3.2,6.4,12.8,25.6,51.2]
    // route as label is a bad thing, as it is not a finite number of values
    // thus, it creates a new histogram, for each new route
    // but if your app has low finite number of different urls, it's ok 
    labelNames: ['status', 'method']
})

export default MetricHistgram;