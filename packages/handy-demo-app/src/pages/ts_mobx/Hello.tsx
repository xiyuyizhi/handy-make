import * as React from "react";

export interface IHelloProps {
  compiler: string;
  framework: string;
}

export default class Hello extends React.Component<IHelloProps, {}> {
  public render() {
    return (
      <h1>
        Hello from {this.props.compiler} and {this.props.framework}!
      </h1>
    );
  }
}
