import React from "react";
import { HashRouter, Route } from "react-router-dom";
import CurrentCart from "../cart/CurrentCart";
import SearchPicture from "../image/SearchPicture";
import UploadPicture from "../image/UploadPicture";
import Info from "../info/Info";
import LoggedInRoute from "../system/tools/LoggedInRoute";
import Login from "../users/Login";
import Password from "../users/Password";
import Register from "../users/Register";
import Welcome from "../welcome/Welcome";
import "./App.css";
import Menu from "./Menu";
import Toolbar from "./Toolbar";
import UserList from "../users/UserList";

export default class App extends React.Component<{}, {}> {
  public render() {
    return (
      <HashRouter>
        <table className="app_table">
          <thead>
            <tr className="app_toolbar">
              <td colSpan={2} >
                <Toolbar />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="app_menu">
                <Menu />
              </td>
              <td id="content" className="app_content">
                <Route exact path="/" component={Welcome} />
                <Route exact path="/login" component={Login} />
                <Route path="/newUser" component={Register} />
                <Route path="/cart" component={CurrentCart} />
                <Route path="/uploadPicture" component={UploadPicture} />
                <Route path="/searchPicture" component={SearchPicture} />
                <Route path="/userList" component={UserList} />
                <LoggedInRoute path="/info" component={Info} />
                <LoggedInRoute path="/password" component={Password} />
              </td>
            </tr>
          </tbody>
        </table>
      </HashRouter >
    );
  }
}
