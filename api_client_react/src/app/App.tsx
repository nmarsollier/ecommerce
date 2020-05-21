import React from "react";
import { HashRouter, Route } from "react-router-dom";
import CurrentCart from "../cart/CurrentCart";
import EditCart from "../cart/EditCart";
import NewArticle from "../catalog/NewArticle";
import SearchArticle from "../catalog/SearchArticle";
import SearchPicture from "../image/SearchPicture";
import UploadPicture from "../image/UploadPicture";
import Info from "../info/Info";
import OrdersList from "../orders/OrdersList";
import SearchOrder from "../orders/SearchOrder";
import LoggedInRoute from "../system/utils/LoggedInRoute";
import Login from "../users/Login";
import Password from "../users/Password";
import Register from "../users/Register";
import UserList from "../users/UserList";
import Welcome from "../welcome/Welcome";
import "./App.css";
import Menu from "./Menu";
import Toolbar from "./Toolbar";

export default function App() {
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
              <Route path="/showPicture/:imageId" component={SearchPicture} />
              <Route path="/userList" component={UserList} />
              <Route path="/newArticle" component={NewArticle} />
              <Route path="/editArticle/:id" component={NewArticle} />
              <Route path="/searchArticle" component={SearchArticle} />
              <Route path="/editCart" component={EditCart} />
              <Route path="/orders" component={OrdersList} />
              <Route path="/searchOrder" component={SearchOrder} />
              <Route path="/showOrder/:orderId" component={SearchOrder} />
              <LoggedInRoute path="/info" component={Info} />
              <LoggedInRoute path="/password" component={Password} />
            </td>
          </tr>
        </tbody>
      </table>
    </HashRouter >
  );
}
