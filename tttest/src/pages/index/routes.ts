import { strict } from "assert";
import MobxGitSearch from "modules/mobxGitSearch";
import { exact } from "prop-types";

interface IRouteDescription {
  path: string;
  exact?: boolean;
  strict?: boolean;
  component: any;
}

export default [
  {
    path: "/",
    exact: true,
    component: MobxGitSearch
    // strict: false
  }
] as IRouteDescription[];
