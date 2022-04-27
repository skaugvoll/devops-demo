import App from './App';
import reportWebVitals from './reportWebVitals';
import { render } from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/*
PAGES START
*/
import PageOk from "./routes/page_ok/page_ok";
import PageTSError from "./routes/page_ts_error/page_ts_error";
;
/*
PAGES END
*/

// DEFAULT CREATE_REACT_APP 
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// REACT ROUTER
const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="ok" element={<PageOk />} />
        <Route path="ts-error" element={<PageTSError />} />
      </Route>
      {/* <Route path="js-error"  /> */}
    </Routes></BrowserRouter>, rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
