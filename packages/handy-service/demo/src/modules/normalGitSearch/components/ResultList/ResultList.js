import ResultItem from "components/ResultItem/ResultItem";

class ResultList extends React.Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    fetchFinish: PropTypes.bool.isRequired
  };

  render() {
    const { list, fetchFinish } = this.props;
    return (
      <ul className="git_search_list">
        {list.length === 0 && fetchFinish ? (
          <div className="git_search_noData">no search</div>
        ) : (
          list.map(x => <ResultItem key={x.id} repoInfo={x} />)
        )}
      </ul>
    );
  }
}

export default ResultList;
