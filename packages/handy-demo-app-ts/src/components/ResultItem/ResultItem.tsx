import * as React from "react";

interface IPropsType {
  repoInfo: {
    stargazers_count: number;
    html_url: string;
    full_name: string;
    language: string;
    description: string;
    id: string;
    owner: {
      avatar_url: string;
    };
  };
}

class ResultItem extends React.Component<IPropsType, {}> {
  public static displayName = "ResultItem";

  public static defaultProps = {};

  public computedStarCount(count: number) {
    if (count > 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  }

  public componentDidMount() {}

  public render() {
    const { repoInfo } = this.props;
    return (
      <div className="list_item">
        <p className="list_item_header">
          <img className="list_item_avatar" src={repoInfo.owner.avatar_url} alt={repoInfo.id} />
          <a href={repoInfo.html_url} target="blank" className="list_item_fullname">
            {repoInfo.full_name}
          </a>
          <span className="list_item_right">
            <span>{repoInfo.language}</span>
            <span className="list_item_star">
              {`${this.computedStarCount(repoInfo.stargazers_count)} star`}
            </span>
          </span>
        </p>
        <p className="list_item_des">{repoInfo.description}</p>
      </div>
    );
  }
}

export default ResultItem;
