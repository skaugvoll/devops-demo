import apm from 'elastic-apm-node';

const agent = apm;

const apmAgentstart = () => {
    agent.start({
        serverUrl: 'http://agent:8200',
        serviceName: 'backend',
        environment: 'local',
        centralConfig: false,
        logLevel: 'debug',
        // transactionSampleRate: 0.5
    });
}


export default apmAgentstart;
