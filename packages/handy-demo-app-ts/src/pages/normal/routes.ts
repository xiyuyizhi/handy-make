import NormalGitSearch from "modules/normalGitSearch";

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
    component: NormalGitSearch
  },
  // @remove-before-createApp
  {
    path: "/normal",
    exact: true,
    component: NormalGitSearch
  }
  // @remove-end-createApp
] as IRouteDescription[];
