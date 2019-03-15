import React from "react";
import { connect } from "react-redux";
import { toggleLeftNav } from "../actions";

import Background from "./menu_items/background";
import Monsters from "./menu_items/monsters";
import PlayerInGame from "./menu_items/players_in_game";

import "../assets/css/menu.css";

class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { left_nav_open, toggleLeftNav } = this.props;

    const left_menu_status = left_nav_open ? "-open" : "-closed";

    return (
      <div className="menu-container left system-menu">
        <div className="left-menu-toggle">
          <i className="fas fa-bars" onClick={e => toggleLeftNav()} />
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
    );
  }
}

function mapStateToProps(state) {
  return {
    left_nav_open: state.navData.left_nav_open
  };
}
export default connect(
  mapStateToProps,
  { toggleLeftNav }
)(LeftMenu);
