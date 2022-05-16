FROM elastic/logstash:8.1.3-arm64

# RUN rm -f /usr/share/logstash/pipeline/logstash.conf # remove the default logstash pipeline that uses beat

# install logstash http input plugin
RUN bin/logstash-plugin install logstash-input-http
