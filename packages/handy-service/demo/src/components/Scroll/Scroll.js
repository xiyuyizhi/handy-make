import { shake } from "utils";
const { Fragment } = React;

class Scroll extends React.Component {
  static displayName = "Scroll";

  static propTypes = {
    loadNextPage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.scroll = shake(this.scroll.bind(this), 300);
  }

  scroll() {
    const documentScrollHeight = document.documentElement.scrollHeight;
    if (documentScrollHeight - this.viewHeight < window.scrollY + 50) {
      this.props.loadNextPage();
    }
  }

  componentDidMount() {
    this.viewHeight = document.documentElement.clientHeight;
    window.addEventListener("scroll", this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scroll);
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default Scroll;
