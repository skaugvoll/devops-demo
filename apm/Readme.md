# APM

## Get started

Go to kibana > fleet
set up policy
quick start
fleet server host https://fleet:8220
generete service token : WRITE THIS DOWN - AAEAAWVsYXN0aWMvZmxlZXQtc2VydmVyL3Rva2VuLTE2NTA5ODE4NDA2NTY6S0dseFkyYXJSMzI4bUk3MzVUSV9TQQ
to to settings tab and enrollment tokens
get token for the created policy
VDJFcVpvQUJ0SWN5YXpXQ2dqWGc6ZHRuc1k3SFdRUENyQ0dXdS1jR2NSdw==

Now start up the fleet container and specify the service token as env var

Go to kibana > APM
Add APM integaration
use apm:8200 and http://apm:8200 as host and url 

Next, install agents to use APM