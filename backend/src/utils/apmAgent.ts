import apm from 'elastic-apm-node';

const agent = apm;

const apmAgentstart = () => {
    agent.start({
        serverUrl: 'http://fleet:8200',
        environment: 'local',
        centralConfig: false,
        logLevel: 'trace',
        transactionSampleRate: 0.5
    });
}


export default apmAgentstart;
