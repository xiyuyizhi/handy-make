import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "./routes";
import { printColor, x } from "./test";
import Hello from "./Hello";

console.log(printColor());
console.log(x);

ReactDOM.render(
  <Router>
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          exact={route.exact}
          strict={route.strict}
          path={route.path}
          component={route.component}
        />
      ))}
    </Switch>
  </Router>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept(() => {}, () => {});
}
