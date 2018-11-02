import ResultItem from "components/ResultItem/ResultItem";
import * as React from "react";

interface IPropTypes {
  list: any[];
  fetchFinish: boolean;
}

const ResultList = ({ list, fetchFinish }: IPropTypes) => (
  <ul className="git_search_list">
    {list.length === 0 && fetchFinish ? (
      <div className="git_search_noData">no search</div>
    ) : (
      list.map((x) => <ResultItem key={x.id} repoInfo={x} />)
    )}
  </ul>
);

export default ResultList;
