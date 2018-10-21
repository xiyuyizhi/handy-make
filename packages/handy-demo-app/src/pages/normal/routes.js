import NormalGitSearch from "modules/normalGitSearch";

export default [
  {
    path: "/",
    exact: true,
    component: NormalGitSearch,
  },
  // @remove-before-createApp
  {
    path: "/normal",
    exact: true,
    component: NormalGitSearch,
  },
  // @remove-end-createApp

];
