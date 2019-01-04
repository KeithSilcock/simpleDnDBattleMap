import React from "react";

import Background from "./menu_items/background";
import Monsters from "./menu_items/monsters";

import "../assets/css/menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu_open: false
    };
  }

  render() {
    return (
      <div className="menu-container">
        <ul className="menu-items">
          <Background setBackground={url => this.props.setBackground(url)} />
          <Monsters
            mapNeedsToUpdate={e => {
              this.props.mapNeedsToUpdate();
            }}
          />
          <li>Settings</li>
        </ul>
      </div>
    );
  }
}

export default Menu;
