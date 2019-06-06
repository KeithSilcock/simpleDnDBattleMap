import React from "react";
import { connect } from "react-redux";
import { toggleRightNav } from "../actions";

import Background from "./menu_items/background";
import Monsters from "./menu_items/monsters";
import PlayerInGame from "./menu_items/players_in_game";

import "../assets/css/menu.css";

class RightMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { right_nav_open, toggleRightNav } = this.props;

    const right_menu_status = right_nav_open ? "-open" : "-closed";

    return (
      <div className="menu-container right entity-menu">
        <div className="right-menu-toggle">
          <i className="fas fa-user" onClick={e => toggleRightNav()} />
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
    );
  }
}

function mapStateToProps(state) {
  return {
    right_nav_open: state.navData.right_nav_open
  };
}
export default connect(
  mapStateToProps,
  { toggleRightNav }
)(RightMenu);
