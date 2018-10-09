import {
  BrowserRouter as Router, Route, Switch, Link
} from "react-router-dom";
import Menus from "components/Menus/Menus";

import routes from "./routes";

const { Fragment } = React;

ReactDOM.render(
  <Fragment>
    <Menus />
    <br />
    <Router>
      <Fragment>
        <Link to="/mobx" style={{ marginRight: 20 }}>
          index
        </Link>
        <Link to="/mobx/test" style={{ marginRight: 20 }}>
          test
        </Link>
        <Link to="/mobx/next">next</Link>
        <Switch>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                exact={route.exact}
                strict={route.strict}
                path={route.path}
                component={route.component}
              />
            );
          })}
        </Switch>
      </Fragment>
    </Router>
  </Fragment>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept(() => {}, () => {});
}
