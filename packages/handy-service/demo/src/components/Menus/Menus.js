import "./Menus.less";
export default class Menus extends React.Component {
  render() {
    return (
      <ul className="top_menus">
        <li>
          <a href="/index">index</a>
        </li>
        <li>
          <a href="/mobx">mobx</a>
        </li>
        <li>
          <a href="/redux">redux</a>
        </li>
      </ul>
    );
  }
}
