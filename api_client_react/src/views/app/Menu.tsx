import React from "react";
import { connect } from "react-redux";
import { IStoredState } from "../../store/sessionStore";
import LoginMenu from "./LoginMenu";
import MainMenu from "./MainMenu";
import "./Menu.css";

class StateMenu extends React.Component<IStoredState, any> {
  public render() {
    const user = this.props.user;
    const menu = user ? <MainMenu /> : <LoginMenu />;

    return (
      <div className="menu_div navbar-nav bg-light shadow">
        {menu}
      </div>
    );
  }
}

const Menu = connect(
  (state: IStoredState) => {
    return { user: state.user };
  })(StateMenu);

export default Menu;
