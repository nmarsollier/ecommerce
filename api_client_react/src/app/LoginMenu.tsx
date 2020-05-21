import React from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

export default function LoginMenu() {
  return (
    <div>
      <h6 className="menu_section">Sesión</h6>
      <NavLink to="/login" className="menu_item btn btn-sm btn-link">Login</NavLink><br />
      <NavLink to="/newUser" className="menu_item btn btn-sm btn-link">Registrarse</NavLink><br />
    </div>
  );
}
