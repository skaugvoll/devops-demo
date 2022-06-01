import Prometheus from "prom-client";
import { METRIC_PREFIX, registry } from "./prometheus"
import os from "os-utils";

const MetricGauge = (config: Prometheus.GaugeConfiguration<string>) => {
    const { name, ...restConfig } = config;
    const metric = new Prometheus.Gauge({
        name: `${METRIC_PREFIX ?? 'backend_'}${name}`,
        ...restConfig
    });
    registry.registerMetric(metric);
    return metric;
};

