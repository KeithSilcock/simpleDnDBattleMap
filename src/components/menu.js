import React from "react";

import Background from "./menu_items/background";

import "../assets/css/menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: {}
    };
  }

  render() {
    const { backgrounds } = this.state;
    return (
      <div className="menu-container">
        <ul className="menu-items">
          <Background setBackground={url => this.props.setBackground(url)} />
          <li>Settings</li>
        </ul>
      </div>
    );
  }
}

export default Menu;
