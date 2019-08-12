import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import sessionStore from "./store/sessionStore";
import "./styles.css";
import App from "./views/app/App";

ReactDOM.render(
    <Provider store={sessionStore}>
        <App />
    </Provider>
    , document.getElementById("root"));
