import { inject, observer } from "mobx-react";
import * as React from "react";
import { shake } from "utils";

interface IPropTypes {
  gitStore?: {
    getUserInput: (s: string) => void;
    fetchStart: boolean;
  };
}

interface IStateInterface {
  fixed: boolean;
}

@inject("gitStore")
@observer
class Search extends React.Component<IPropTypes, {}> {
  public state: IStateInterface;
  constructor(props: IPropTypes) {
    super(props);
    this.fetchRepos = shake(this.fetchRepos.bind(this), 600);
    this.scroll = shake(this.scroll.bind(this), 100);
    this.state = {
      fixed: false
    };
  }

  public fetchRepos = (keyword: string) => {
    this.props.gitStore.getUserInput(keyword);
  }

  public onChangeHandle = (e: any) => {
    this.fetchRepos(e.target.value);
  }

  public scroll = () => {
    if (window.scrollY > 230) {
      if (this.state.fixed) {
        return;
      }
      this.setState({
        fixed: true
      });
      return;
    }
    if (!this.state.fixed) {
      return;
    }
    this.setState({
      fixed: false
    });
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.scroll);
  }

  public render() {
    const { fetchStart } = this.props.gitStore;
    const cls = this.state.fixed
      ? "git_search_search  git_search_search_fixed"
      : "git_search_search";
    return (
      <div className={cls}>
        <span className="git_search_search_input_wrapper">
          <input
            type="text"
            placeholder="react"
            className="git_search_input"
            onChange={this.onChangeHandle}
          />
          {fetchStart ? <span className="git_search_search_loading">loading...</span> : null}
        </span>
      </div>
    );
  }
}

export default Search;
