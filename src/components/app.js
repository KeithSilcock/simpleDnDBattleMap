import React from "react";
import GridLayout from "./gridLayout";
import Menu from "./menu";

import firebaseApp from "../firebase";

import "../assets/css/app.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: { board_size_x: 100, board_size_y: 100, current_board: null },
      activeBackground: ""
    };

    this.db = firebaseApp.database();
    this.storage = firebaseApp.storage();
  }

  componentDidMount() {
    this.getSettings();
  }

  getSettings() {
    const { settings } = this.state;
    this.db.ref(`settings`).on("value", snapshot => {
      const initial_settings = snapshot.val();
      console.log("settings snapshot", initial_settings);

      this.setState(
        {
          ...this.state,
          settings: initial_settings
        },
        () => {
          console.log("Initial Settings", this.state);
          this.setBackground(this.state.settings.current_board);
        }
      );
    });
  }

  setBackground(url) {
    this.db
      .ref("settings")
      .update({
        current_board: url
      })
      .then(() => {
        this.setState(
          {
            ...this.state,
            activeBackground: url
          },
          () => {
            console.log("got background", url);
          }
        );
      });
  }

  render() {
    const { activeBackground, settings } = this.state;

    return (
      <div className="app-container">
        <Menu
          settings={settings}
          setBackground={url => this.setBackground(url)}
        />
        <GridLayout settings={settings} backgroundURL={activeBackground} />
      </div>
    );
  }
}

export default App;
