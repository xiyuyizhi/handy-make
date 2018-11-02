import ResultItem from "components/ResultItem/ResultItem";
import { inject, observer } from "mobx-react";
import * as React from "react";

interface IPropTypes {
  gitStore?: {
    list: any[];
    count: number;
    fetchFinish: boolean;
  };
}

@inject("gitStore")
@observer
class ResultList extends React.Component<IPropTypes, {}> {
  public render() {
    const { list, count, fetchFinish } = this.props.gitStore;
    return (
      <ul className="git_search_list">
        {count === 0 && fetchFinish ? (
          <div className="git_search_noData">no search</div>
        ) : (
          list.map((x) => <ResultItem key={x.id} repoInfo={x} />)
        )}
      </ul>
    );
  }
}

export default ResultList;
