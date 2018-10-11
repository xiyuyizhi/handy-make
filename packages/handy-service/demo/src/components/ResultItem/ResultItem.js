class ResultItem extends React.Component {
  static displayName = "ResultItem";

  static propTypes = {
    repoInfo: PropTypes.object.isRequired
  };

  static defaultProps = {};

  computedStarCount(count) {
    if (count > 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count;
  }

  componentDidMount() {}

  render() {
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
