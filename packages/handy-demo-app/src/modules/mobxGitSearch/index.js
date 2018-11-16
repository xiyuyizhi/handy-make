import { Provider } from "mobx-react";
import Scroll from "components/Scroll/Scroll";
import SearchGitStore from "stores/SearchGitStore";
import "handy-demo-common/index.css";
import Search from "./components/Search/Search";
import ResultList from "./components/ResultList/ResultList";

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
