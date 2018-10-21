import MobxGitSearch from "modules/mobxGitSearch";

export default [
  {
    path: "/",
    exact: true,
    component: MobxGitSearch,
  },
  // @remove-before-createApp
  {
    path: "/mobx",
    exact: true,
    component: MobxGitSearch,
  },
  // @remove-end-createApp

];
