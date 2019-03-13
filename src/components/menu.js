import React from "react";

import Background from "./menu_items/background";
import Monsters from "./menu_items/monsters";
import PlayerInGame from "./menu_items/players_in_game";

import "../assets/css/menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      left_menu_open: false,
      right_menu_open: false
    };
  }

  openLeftMenu() {
    this.setState({
      ...this.state,
      left_menu_open: true
    });
  }
  closeLeftMenu() {
    this.setState({
      ...this.state,
      left_menu_open: false
    });
  }
  openRightMenu() {
    this.setState({
      ...this.state,
      right_menu_open: true
    });
  }
  closeRightMenu() {
    this.setState({
      ...this.state,
      right_menu_open: false
    });
  }
  toggleLeftMenu() {
    const { left_menu_open } = this.state;
    if (left_menu_open) {
      this.closeLeftMenu();
    } else {
      this.openLeftMenu();
    }
  }
  toggleRightMenu() {
    const { right_menu_open } = this.state;
    if (right_menu_open) {
      this.closeRightMenu();
    } else {
      this.openRightMenu();
    }
  }

  render() {
    const { left_menu_open, right_menu_open } = this.state;

    const left_menu_status = left_menu_open ? "-open" : "-closed";
    const right_menu_status = right_menu_open ? "-open" : "-closed";

    return (
      <div className="menus-container">
        <div className="menu-container system-menu">
          <div className="left-menu-toggle">
            <i className="fas fa-bars" onClick={e => this.toggleLeftMenu()} />
          </div>
          <ul className={`menu-items left-menu${left_menu_status}`}>
            <Background setBackground={url => this.props.setBackground(url)} />
            <Monsters
              mapNeedsToUpdate={e => {
                this.props.mapNeedsToUpdate();
              }}
            />
            <li>Settings</li>
          </ul>
        </div>
        <div className="menu-container entity-menu">
          <div className="right-menu-toggle">
            <i className="fas fa-user" onClick={e => this.toggleRightMenu()} />
          </div>
          <ul
            className={`menu-items entities-menu right-menu${right_menu_status}`}
          >
            Players holder:
            <PlayerInGame
              setHighlightedEntity={e => {
                this.props.setHighlightedEntity(e);
              }}
            />
          </ul>
        </div>
      </div>
    );
  }
}

export default Menu;
