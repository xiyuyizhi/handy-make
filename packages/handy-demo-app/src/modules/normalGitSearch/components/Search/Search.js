import { shake } from "utils";

class Search extends React.Component {
  static propTypes = {
    getUserInput: PropTypes.func.isRequired,
    fetchStart: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.fetchRepos = shake(this.fetchRepos.bind(this), 600);
    this.scroll = shake(this.scroll.bind(this), 100);
    this.state = {
      fixed: false,
    };
  }

  fetchRepos = (keyword) => {
    this.props.getUserInput(keyword);
  };

  onChangeHandle = (e) => {
    this.fetchRepos(e.target.value);
  };

  scroll = () => {
    if (window.scrollY > 230) {
      if (this.state.fixed) return;
      this.setState({
        fixed: true,
      });
      return;
    }
    if (!this.state.fixed) return;
    this.setState({
      fixed: false,
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.scroll);
  }

  render() {
    const { fetchStart } = this.props;
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
          {fetchStart ? (
            <span className="git_search_search_loading">loading...</span>
          ) : null}
        </span>
      </div>
    );
  }
}

export default Search;
