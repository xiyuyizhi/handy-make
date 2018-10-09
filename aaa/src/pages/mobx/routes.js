import MobxGitSearch from "modules/mobxGitSearch";

const Test = () => {
  return <div>test</div>;
};

const Next = () => {
  return <div>next</div>;
};

export default [
  {
    path: "/mobx",
    exact: true,
    component: MobxGitSearch
  },
  {
    path: "/mobx/test",
    component: Test
  },
  {
    path: "/mobx/next",
    component: Next
  }
];
