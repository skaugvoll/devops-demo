import apm from 'elastic-apm-node';

const agent = apm;

const apmAgentstart = () => {
    agent.start({
        serviceName: "backend_2",
        serverUrl: 'http://fleet:8200',
        environment: 'local',
        centralConfig: false,
        // logLevel: 'trace',
        transactionSampleRate: 0.5,

    });
    return agent;
}


export default apmAgentstart;
