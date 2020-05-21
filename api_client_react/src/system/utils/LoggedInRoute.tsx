import React from "react";
import { useSelector } from "react-redux";
import { Route, RouteComponentProps } from "react-router-dom";
import Welcome from "../../welcome/Welcome";
import { IStoredState } from "../store/SessionStore";

interface IProps {
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export default function StateLoggedInRoute(props: IProps) {
  const token = useSelector((state: IStoredState) => state.token)

  if (token === undefined) {
    return (<Route exact path={props.path} component={Welcome} />);
  } else {
    return (<Route exact path={props.path} component={props.component} />);
  }
}
