import Prometheus from "prom-client";
import { METRIC_PREFIX, registry } from "./prometheus"

const MetricGauge = (config: Prometheus.GaugeConfiguration<string>) => {
    const { name, ...restConfig } = config;
    const metric = new Prometheus.Gauge({
        name: `${METRIC_PREFIX ?? 'backend_two_'}${name}`,
        ...restConfig
    })
    registry.registerMetric(metric);
    return metric;
};

