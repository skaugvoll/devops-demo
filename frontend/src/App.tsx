import React from 'react';
import logo from './logo.svg';

import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <nav>
        <p>Navigation</p>
        <ul style={{ textAlign: 'left' }}>
          <li><Link to="/ok">200</Link></li>
          <li><Link to="/ts-error">TS error</Link></li>
          {/* <li><Link to="/js-error">JS error</Link></li>
            <li><Link to="/backend-error">backend error</Link></li> */}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

export default App;
