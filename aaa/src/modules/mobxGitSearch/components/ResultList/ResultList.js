import { observer, inject } from "mobx-react";
import ResultItem from "components/ResultItem/ResultItem";

@inject("gitStore")
@observer
class ResultList extends React.Component {
  static propTypes = {
    gitStore: PropTypes.object.isRequired
  };

  render() {
    const { list, count, fetchFinish } = this.props.gitStore;
    return (
      <ul className="git_search_list">
        {count === 0 && fetchFinish ? (
          <div className="git_search_noData">no search</div>
        ) : (
          list.map(x => <ResultItem key={x.id} repoInfo={x} />)
        )}
      </ul>
    );
  }
}

export default ResultList;
