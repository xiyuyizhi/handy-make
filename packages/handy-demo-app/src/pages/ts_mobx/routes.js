import MobxGitSearch from "modules/mobxGitSearch";

export default [
  {
    path: "/",
    exact: true,
    component: MobxGitSearch
  },
  //@remove-before-createApp
  {
    path: "/ts_mobx",
    exact: true,
    component: MobxGitSearch
  }
  //@remove-end-createApp
];
