# Monitoring and Observability

## Monitoring
I would say that there are four-five pillars of monitoring any server-application

1. Latency (Request duration)

2. Saturation (basically, how much of resource X is being used, and how much is available for consumption
    a. memory saturation
        - Using close to and sometimes 100 % memory is not that bad, it means we are storing as much as possible in memory for quick access, but then we need to know that we are still able to load in and out of memory the less frequient requestes resocures.
    b. cpu saturation
        - should not be 100% but close, should have high cpu utilization, but when reaching a certain treshold, scale up/out

3. Request Error rate
    - how frequent are we responding with an error code ?
    - what endpoints are responsible for the error status code ? - observability

4. Number of requests (remember that health-probes and e.g. prometheus scrape are most likely counted as well
    - eg. 13requests pr minute (12 probe, 1 prometheus scrape) = 13/60s => 0.217:req/sec (0.217 * 60) = 13:req/m

5. Service Catalog Vitals
    - is the application green (running)
    - is the application red (failing)



