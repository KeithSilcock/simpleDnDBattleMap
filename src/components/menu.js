import React from "react";
import firebaseApp from "../firebase";

import Background from "./menu_items/background";

import "../assets/css/menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: {}
    };

    this.storage = firebaseApp.storage();
    this.db = firebaseApp.database();
  }

  componentDidMount() {
    this.db.ref("terrains").once("value", snapshot => {
      const data = snapshot.val();
      this.setState({
        ...this.state,
        backgrounds: data
      });
    });
  }

  render() {
    const { backgrounds } = this.state;
    return (
      <div className="menu-container">
        <ul className="menu_items">
          <Background
            setBackground={url => this.props.setBackground(url)}
            backgrounds={backgrounds}
          />
          <li>Settings</li>
        </ul>
      </div>
    );
  }
}

export default Menu;
