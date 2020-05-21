import React from "react";
import { useSelector } from "react-redux";
import { IStoredState } from "../system/store/SessionStore";
import "./Toolbar.css";

export default function Toolbar() {
  const user = useSelector((state: IStoredState) => state.user)

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark d-flex shadow">
      <div className="toolbar_icon">
        <img src="/assets/favicon.png" alt=""></img>
      </div>

      <div className="toolbar_title navbar-brand flex-grow-1">
        Microservicios {user ? " - " + user.name : ""}
      </div>

      <div className="toolbar_title navbar-brand">
        Docs:
        </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3000/" target="auth"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Auth
          </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3001/" target="image"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Image
          </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3002/" target="catalog"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Catalog
          </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3003/" target="cart"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Cart
          </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3004/" target="order"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Order
          </a>
      </div>
    </nav>
  );
}
