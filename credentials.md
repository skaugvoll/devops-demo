<!-- 1.  apm_system
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
    1.  lvx1yVEjiXGYXZyhTrEB -->

================================================================================

Changed password for user apm_system
PASSWORD apm_system = qWPdLqyeOjPGjc2Y0ieF

Changed password for user kibana_system
PASSWORD kibana_system = aLao9KQwI12aFlMiIdhc

Changed password for user kibana
PASSWORD kibana = aLao9KQwI12aFlMiIdhc

Changed password for user logstash_system
PASSWORD logstash_system = OUdlit9gGnj8tfQF1EcL

Changed password for user beats_system
PASSWORD beats_system = 7VXRTNHhf9n39LGSn4lU

Changed password for user remote_monitoring_user
PASSWORD remote_monitoring_user = Ik7ZOFspKMJsqXEeHqOG

Changed password for user elastic
PASSWORD elastic = WEct71W1PI1ufyVTd7NH
GITVBLBXAWCsB3WxN8s7

================================================================================


```
POST _security/role/logstash_writer
{
  "cluster": ["manage_index_templates", "monitor", "manage_ilm"], 
  "indices": [
    {
      "names": [ "logstash-*" ], 
      "privileges": ["write","create","create_index","manage","manage_ilm"]  
    }
  ]
}
```

```
{
  "role" : {
    "created" : true
  }
}
```

```
POST _security/user/logstash_internal
{
  "password" : "x-pack-test-password",
  "roles" : [ "logstash_writer"],
  "full_name" : "Internal Logstash User"
}
```

```
{
  "created" : true
}
```

