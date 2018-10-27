import ResultItem from "components/ResultItem/ResultItem";

const ResultList = ({ list, fetchFinish }) => (
  <ul className="git_search_list">
    {list.length === 0 && fetchFinish ? (
      <div className="git_search_noData">no search</div>
    ) : (
      list.map(x => <ResultItem key={x.id} repoInfo={x} />)
    )}
  </ul>
);

ResultList.propTypes = {
  list: PropTypes.array.isRequired,
  fetchFinish: PropTypes.bool.isRequired,
};

export default ResultList;
