import { Fetcher } from "handy-demo-common";
import Scroll from "components/Scroll/Scroll";
import Search from "./components/Search/Search";
import ResultList from "./components/ResultList/ResultList";

import "handy-demo-common/index.css";

export default class IndexGitSearch extends React.Component {
  constructor(props) {
    super(props);
    this.page = 1;
    this.keyword = "";
    this.state = {
      fetchStart: false,
      fetchFinish: false,
      list: []
    };
  }

  getUserInput = keyword => {
    if (!keyword) return;
    this.keyword = keyword;
    this.page = 1;
    this.fetchRepos();
  };

  fetchRepos = () => {
    this.setState({
      fetchStart: true,
      list: this.page === 1 ? [] : this.state.list
    });
    Fetcher.fecthRepos(this.keyword, this.page).then(data => {
      if (!data.items) {
        alert(data.message);
      } else if (this.page !== 1) {
        this.setState(preState => {
          return {
            list: [...preState.list, ...data.items]
          };
        });
      } else {
        this.setState({
          list: data.items
        });
      }
      this.setState({
        fetchFinish: true,
        fetchStart: false
      });
    });
  };

  loadNextPage = () => {
    this.page++;
    this.fetchRepos();
  };

  render() {
    const { fetchStart, list, fetchFinish } = this.state;
    return (
      <div className="git_search_context">
        <Scroll loadNextPage={this.loadNextPage}>
          <Search getUserInput={this.getUserInput} fetchStart={fetchStart} />
          <ResultList list={list} fetchFinish={fetchFinish} />
        </Scroll>
      </div>
    );
  }
}
