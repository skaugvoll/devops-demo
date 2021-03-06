import { init as initApm } from '@elastic/apm-rum'
import App from './App';
// import reportWebVitals from './reportWebVitals';

import { render } from "react-dom";
import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import { ApmRoute } from '@elastic/apm-rum-react';

import PageOk from './routes/page_ok/page_ok';
import PageBEError from './routes/page_backend_error/page_backend_error';

initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'frontend',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://localhost:8200', // browser, thus locahost, not server to server

  // logLevel: 'trace',
  distributedTracing: true,
  distributedTracingOrigins: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://backend:3000',
    'http://backendtwo:3000',
  ]

  // Set service version (required for sourcemap feature)
  // serviceVersion: ''
})

const Routes = () => (
  <Router>
    <div>
      <Link to="/">Home</Link><br />
      <Link to="/ok">OK</Link><br />
      <Link to="/be-error">BE-Error</Link>
    </div>
    <ApmRoute exact path="/" component={App} />
    <Switch>
      <ApmRoute exact path="/ok" component={PageOk} />
      <ApmRoute exact path="/be-error" component={PageBEError} />

    </Switch>
  </Router >
);

// REACT ROUTER
const rootElement = document.getElementById('root');
render(<Routes />, rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
