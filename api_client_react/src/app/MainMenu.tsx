import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { IStoredState, logout } from "../system/store/SessionStore";
import "./Menu.css";

class StateMainMenu extends React.Component<IStoredState, any> {
  public logout = async () => {
    await logout();
  }

  public render() {
    return (
      <div>
        <h6 className="menu_section">{this.props.user  ? this.props.user.name : ""}</h6>
        <NavLink to="/info" className="menu_item btn btn-sm btn-link">Sesión</NavLink><br />
        <NavLink to="/password" className="menu_item btn btn-sm btn-link">Password</NavLink><br />
        <NavLink to="" onClick={this.logout} className="menu_item btn btn-sm btn-link">Logout</NavLink><br />
        <h6 className="menu_section">Admin</h6>
        <NavLink to="/userList" className="menu_item btn btn-sm btn-link">Usuarios</NavLink><br />
        <h6 className="menu_section">Imágenes</h6>
        <NavLink to="/uploadPicture" className="menu_item btn btn-sm btn-link">Subir Imagen</NavLink><br />
        <NavLink to="/searchPicture" className="menu_item btn btn-sm btn-link">Buscar Imagen</NavLink><br />
        <h6 className="menu_section">Carrito</h6>
        <NavLink to="/cart" className="menu_item btn btn-sm btn-link">Carrito Actual</NavLink><br />
      </div>
    );
  }
}

const MainMenu = connect(
  (state: IStoredState) => {
    return { user: state.user };
  })(StateMainMenu);

export default MainMenu;
