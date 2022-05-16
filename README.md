# devops-demo
Repository holding demo about DevOps tools, such as ELK-stack, RUM, Grafana, Prometheus, etc.


# Run me 
1. first time, 
2. we need to start the elasticsearch container on it's own
3. Credentials
   1. first start gives credentials in stdout, so just scroll til you find it. save them to a file
   2. If they dont show up, then we can jump into the container and run `~/bin/elasticsearch-setup-passwords auto` and save the output
4. then we can update the kibana container env vars to use the kibana_system password
5. then we can start up kibana as well
6. then we need to configure fleet server
   1. management > fleet
   2. step 1  (create default value)
   3. skip 2
   4. step 3 use quick 
   5. step 4 http://fleet:8220
   6. step 5 generate service token
7. Now we can update the fleet container to use the service token created in step above (6.5)
8.  start the fleet / agent container
9.  wait for kibana dashboard to update with connected to fleet server
10. click done
11. check fleet / agent settings that it has `fleet:8220` and `elasticsearch:9200`
12. choose / click on default fleet server policy and add integration docker
    1.  add docker and save integration with the default settings. then save and deploy

13. Next we need to set up Kibana APM
https://www.elastic.co/guide/en/apm/guide/current/apm-quick-start.html

    1.  Next add APM integration to the policy we want it to use (Default Fleet policy in this example)
        1.  Just go through and set host fleet:8200 and url http://fleet:8200
        2.  Question: do we need to have a separate apm server ? - NO we do not
        3.  then I'll try to send apm metrics to fleet instance instead. did work, just remember to open port 8200:8200
        4.  Now the applications with language-apm-agents can use http://fleet:8200 to send metrics

1.  instrument applications to send data to fleet:8200
    1.  remember to fix CORS and add additional headers for distributed tracing for rum

2.  Log correlation
    1.  add morgan, and create the correct log format including apm trace ids for log correlation

3.   Set up filebeat to collect logs from docker containers

>First filebeat to retrive logs, then send them to logstash for parsing, then logstash sends them to elasticsearch ingest
>pipeline that we need to set up, before elastic ingest logs into wanted index

>NB: remember to update filebeat.yml and docker-compose.yml to have updated username and password for elastic account

1.   Set up logstash so that filebeat can send to logstash, which sends them to elasticsearch
    1.  https://www.elastic.co/guide/en/logstash/current/ls-security.html 
    We also need to create a few `new` `roles` and `users` to allow logstash to send data to elasticsearch. `For this we need elasticsearch and kibana to be running`


**!!BEFORE STARTING filebeat and logstash, start up es, kibana, apm**
then in kibana, go to stack management, indgest pipelines, create pipeline
give it a name (this name must match the pipeline in filebeat output.elsticsearch.pipeline) config. I use `log-correlation`
Add processor type `grok`
For the values / configuration of the processor, see filebeat/modules/elasticsearch/log-correlation.yml
then click add.

Now we need to set up the logstash users and roles

kibana > stack management > roles
follow: https://www.elastic.co/guide/en/logstash/current/ls-security.html

do the logstash_internal user and role, and then edit the user and give role superuser just to get things moving along. This is a demo, so don't need to be super secure.
Also: Edit the logstash-writer role, and assign;
cluster privilages: all
index privilages: all
add indicies: "*": all to the logstash-* indicies
create a new indicies "*" with "all" privilage

Then go to observability, stream, settings, add logstash-* as index
add container.name as a field as well. This should help us validate that we are actually getting logs from logstash into elasticsearch and visualize them in Kibana.

Now we are ok to start up logstash and filebeat
the logs should be found under observability > stream 

Next step would be to add ingest-pipeline with grok filter to add trace id to logs










# TODO: add volume to kibana and agent so that we don't need to do all steps every time we start up, only first time
I've added some, so after dowing docker-compose down and up, same credentials and fleet enrollment should still work

# Coming back,
it should be just to docker-compose up
if the fleet server has trouble, docker-compose down, comment out the service, start up es and kibana, then start the fleet service.

# Troubleshoot
if it does not work; delete network && delete volumes (docker volume rm .... && docker network rm ...)
then; start from scratch and follow steps above


