import * as React from "react";

import { shake } from "utils";

const { Fragment } = React;

interface IPropTypes {
  loadNextPage: () => void;
}

class Scroll extends React.Component<IPropTypes, {}> {
  public static displayName = "Scroll";
  public viewHeight: number;
  constructor(props: IPropTypes) {
    super(props);
    this.scroll = shake(this.scroll.bind(this), 300);
  }

  public scroll() {
    const documentScrollHeight = document.documentElement.scrollHeight;
    if (documentScrollHeight - this.viewHeight < window.scrollY + 50) {
      this.props.loadNextPage();
    }
  }

  public componentDidMount() {
    this.viewHeight = document.documentElement.clientHeight;
    window.addEventListener("scroll", this.scroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.scroll);
  }

  public render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default Scroll;
