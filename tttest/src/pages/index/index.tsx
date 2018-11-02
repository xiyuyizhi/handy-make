import MobxGitSearch from "modules/mobxGitSearch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "./routes";

ReactDOM.render(
  <Router>
    <React.Fragment>
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} exact={route.exact} path={route.path} component={route.component} />
        ))}
      </Switch>
    </React.Fragment>
  </Router>,
  document.getElementById("root")
);

if ((module as any).hot) {
  (module as any).hot.accept(() => {});
}
