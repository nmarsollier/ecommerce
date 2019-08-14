import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app/App";
import "./styles.css";
import sessionStore from "./system/store/SessionStore";

ReactDOM.render(
    <Provider store={sessionStore}>
        <App />
    </Provider>
    , document.getElementById("root"));
