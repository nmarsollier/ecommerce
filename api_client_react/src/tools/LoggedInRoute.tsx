import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { IStoredState } from "../store/sessionStore";
import Welcome from "../views/welcome/Welcome";

interface IProps extends IStoredState {
  path: string;
  component: React.ComponentClass;
}

class StateLoggedInRoute extends React.Component<IProps, any> {
  public render() {
    if (this.props.token === undefined) {
      return (<Route exact path={this.props.path} component={Welcome} />);
    } else {
      return (<Route exact path={this.props.path} component={this.props.component} />);
    }
  }
}

const LoggedInRoute = connect(
  (state: IProps) => {
    return {
      token: state.token,
    };
  })(StateLoggedInRoute);

export default LoggedInRoute;
