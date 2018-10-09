import IndexGitSearch from "modules/indexGitSearch";

export default [
  {
    path: "/index",
    exact: true,
    component: IndexGitSearch
  },
  {
    path: "/",
    exact: true,
    component: IndexGitSearch
  }
];
