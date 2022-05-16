# Demo

The demo should showcase
1. Distributed tracing:
   1. That we can identify where in the "distributed service-chain" an error occured.
   2. That we can add meta-data to the errors, so we can search for e.g. specific username, user.id or user.email to target a specific customer/user's error case
   3. That we can give custom attributes to APM-Errors, to help tag, identify and clarify errors.
2. Log correlation with traces
   1. Show that we can see logs that corresponds to an request that failed. e.g request from frontend to backend_1 to backend_2. We can get a group of e.g. express logs, for each service and only the logs "generated" by the request that failes.
      1. This examples shows that we can even capture logs that are generate in code and not by express and morgan. trigger `be-error`, and then investigate the trace, than we can see that there should be a log entry starting with `<server 1>: returning /data ....` It also shows that we have logs for backend 1 and backend 2 for the trace so we can see what logs where outputed by each service




## NOTE!
Based on error handling-strategy and implementation,
the visualization in Elastic APM service-traces are going to change
So if Service B sends request to service C, and service C trows error,
Service B will be taged as failed, since it returs en error code, and service C will not show up. This indicates that service C failed, and thus Service B failes. Etc.
Using different error-handling implementation, we chan change this behaviour to suit are needs and likings.

