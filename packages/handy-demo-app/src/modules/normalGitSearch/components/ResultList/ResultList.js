import ResultItem from "components/ResultItem/ResultItem";


export default ({ list, fetchFinish }) => (
  <ul className="git_search_list">
    {list.length === 0 && fetchFinish ? (
      <div className="git_search_noData">no search</div>
    ) : (
      list.map(x => <ResultItem key={x.id} repoInfo={x} />)
    )}
  </ul>
);
