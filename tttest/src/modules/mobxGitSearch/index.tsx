import Scroll from "components/Scroll/Scroll";
import { Provider } from "mobx-react";
import * as React from "react";
import SearchGitStore from "stores/SearchGitStore";
import ResultList from "./components/ResultList/ResultList";
import Search from "./components/Search/Search";

import "handy-demo-common/index.css";

export default () => {
  const searchGitStore = new SearchGitStore();
  return (
    <div className="git_search_context">
      <Provider gitStore={searchGitStore}>
        <Scroll loadNextPage={searchGitStore.loadNextPage}>
          <Search />
          <ResultList />
        </Scroll>
      </Provider>
    </div>
  );
};
