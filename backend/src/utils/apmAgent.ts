import apm from 'elastic-apm-node';

const agent = apm;

const apmAgentstart = () => {
    agent.start({
        serviceName: "backend",
        serverUrl: 'http://fleet:8200',
        environment: 'local',
        centralConfig: false,
        // logLevel: 'trace',
        transactionSampleRate: 0.5,
    });
    return agent;
}

export const getAgent = () => agent;

export default apmAgentstart;
