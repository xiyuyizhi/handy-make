import Scroll from "components/Scroll/Scroll";
import { Fetcher } from "handy-demo-common";
import * as React from "react";
import ResultList from "./components/ResultList/ResultList";
import Search from "./components/Search/Search";

import "handy-demo-common/index.css";

interface IState {
  fetchStart: boolean;
  fetchFinish: boolean;
  list: any[];
}

export default class IndexGitSearch extends React.Component<{}> {
  public page: number;
  public keyword: string;
  public state: IState;
  constructor(props: any) {
    super(props);
    this.page = 1;
    this.keyword = "";
    this.state = {
      fetchStart: false,
      fetchFinish: false,
      list: []
    };
  }

  public getUserInput = (keyw: string): void => {
    if (!keyw) { return; }
    this.keyword = keyw;
    this.page = 1;
    this.fetchRepos();
  }

  public fetchRepos = () => {
    this.setState((preState: IState) => ({
      fetchStart: true,
      list: this.page === 1 ? [] : preState.list
    }));
    Fetcher.fecthRepos(this.keyword, this.page).then((data: any) => {
      if (!data.items) {
        alert(data.message);
      } else if (this.page !== 1) {
        this.setState((preState: IState) => ({
          list: [...preState.list, ...data.items]
        }));
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
  }

  public loadNextPage = () => {
    this.page += 1;
    this.fetchRepos();
  }

  public render() {
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
