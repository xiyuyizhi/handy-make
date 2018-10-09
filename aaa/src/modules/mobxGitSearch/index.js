import { Provider } from "mobx-react";
import Scroll from "components/Scroll/Scroll";
import SearchGitStore from "stores/SearchGitStore";
import Search from "./components/Search/Search";
import ResultList from "./components/ResultList/ResultList";

import "handy-demo-common/index.css";

export default class MobxGitSearch extends React.Component {
  render() {
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
  }
}
