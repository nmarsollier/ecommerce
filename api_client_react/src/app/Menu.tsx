import React from "react";
import { useSelector } from "react-redux";
import { IStoredState } from "../system/store/SessionStore";
import LoginMenu from "./LoginMenu";
import MainMenu from "./MainMenu";
import "./Menu.css";

export default function Menu() {
  const user = useSelector((state: IStoredState) => state.user)

  const menu = user ? <MainMenu /> : <LoginMenu />;

  return (
    <div className="menu_div navbar-nav bg-light shadow">
      {menu}
    </div>
  );
}
