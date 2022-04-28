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
   2. skip step 1 and 2
   3. step 3 use quick 
   4. step 4 http://agent:8220
   5. step 5 generate service token
7. Now we can update the agent container to use the service token in env var
8.  start the fleet / agent container
9.  wait for kibana dashboard to update with connected to fleet server
10. click done
11. check fleet / agent settings that it has agent:8220 and elasticsearch:9200
12. choose / click on default fleet server policy and add integration docker
    1.  add docker and save integration with the default settings. then save and deploy

Next we need to set up Kibana APM
https://www.elastic.co/guide/en/apm/guide/current/apm-quick-start.html

Next add APM integration to the policy we want it to use (Default Fleet policy in this example)
Just go through and set host apm:8200 and url http://apm:8200

Question: do we need to have a separate apm server ?
I will first try to set up an apm server
remember to change settings in apm config to have correct passwords! - I dont have them with the alpha versions being used

then I'll try to send apm metrics to agent instead. did not work

looks like we need another agent, that is not a fleet server.

go to fleet, and then select enrollment tokens, and copy the one from Default Fleet Server policy
update apm service to use this token

docker-compose up


comment in the apm (agent) service


# TODO: add volume to kibana and agent so that we don't need to do all steps every time we start up, only first time
I've added some, so after dowing docker-compose down and up, same credentials and fleet enrollment should still work

# Coming back,
it should be just to docker-compose up
if the fleet server has trouble, docker-compose down, comment out the service, start up es and kibana, then start the fleet service.

# Troubleshoot
if it does not work
delete network
delete volumes

start from scratch and follow steps above