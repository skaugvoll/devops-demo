# Elasticsearch

## How to get started

### First time running

1. `docker-compose up`
2. Disable xpack, so that we can get certification and credentials `xpack.security.enabled: false`
3. When this is run, exec into elasticsearch container
   1. run `bin/elasticsearch-certutil ca`
   2. then run `bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12`
4. on host machine `docker cp <elasticsearch_container_id>:/usr/share/elasticsearch/elastic-certificates.p12 .`
5. re-enable xpack `xpack.security.enabled: true`
6. update docker-compose to contain the certicifate as volume mount
   1. `- ./elastic-certificates.p12:/usr/share/elasticsearch/config/elastic-certificates.p12`
7. Then update elasticsearch.yml file to contain
   - `xpack.security.enabled: true`
   - `xpack.security.transport.ssl.enabled: true`
   - `xpack.security.transport.ssl.keystore.type: PKCS12`
   - `xpack.security.transport.ssl.verification_mode: certificate`
   - `xpack.security.transport.ssl.keystore.path: elastic-certificates.p12`
   - `xpack.security.transport.ssl.truststore.path: elastic-certificates.p12`
   - `xpack.security.transport.ssl.truststore.type: PKCS12`
8. Configure data volume for elasticsearch 
   1. on root level of project (where docker-compose file is located), create folder(s) `docker-data-volumes/elasticsearch`
   2. add to docker-compose.services[n].elasticsearch.volumes `- ./docker-data-volumes/elasticsearch:/usr/share/elasticsearch/data`
9.  spin up elasticsearch and jump into the container
    1.  `bin/elasticsearch-setup-passwords auto`
    2.  Note down the credentials
        1.  apm_system
            1.  2QeOr5yVBBirtuIKVkLP
        2.  kibana_system
            1.  cqpgCa2WE2q2KK1AwYQO
        3.  kibana
            1.  cqpgCa2WE2q2KK1AwYQO
        4.  logstash_system
            1.  Mhr2AJE1ZNL9Odfcien7
        5.  beats_system
            1.  lKYIBvQJCJAGR9AYMQSm
        6.  remote_monitoring_user
            1.  O1z23RtRuR8cJOxukRLp
        7.  elastic
            1.  lvx1yVEjiXGYXZyhTrEB
10. update kibana.yml
    1.  elasticsearch.username: kibana
    2.  elasticsearch.password: <kibana password>
11. Now we should be able to open localhost:9200
    1.  enter username:password elastic:<elastic password>
12. Now we should be able to open localhost:5601 (kibana)
    1.  enter same user and password as for elasticsearch
        1.  elastic:<elastic password>


>NB:
>since we created the `docker-data-volume` and have a static `elastic-certificates.p12`, we can reuse the config next time we want to start from scratch, and skip all the steps above

