import React from "react";
import GridLayout from "./grid_layout";
import Menu from "./menu";

import firebaseApp from "../firebase";

import "../assets/css/app.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: { board_size_x: 100, board_size_y: 100, current_board: null },
      activeBackground: "",
      updateMap: false,
      highlightedEntity: null
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

  mapUpdated() {
    this.setState({
      ...this.state,
      updateMap: false
    });
  }

  mapNeedsToUpdate() {
    this.setState({
      ...this.state,
      updateMap: true
    });
  }

  setHighlightedEntity(entity) {
    this.setState({
      ...this.state,
      highlightedEntity: entity
    });
  }

  render() {
    const {
      activeBackground,
      settings,
      updateMap,
      highlightedEntity
    } = this.state;

    return (
      <div className="app-container">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
          integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
          crossOrigin="anonymous"
        />
        <GridLayout
          settings={settings}
          updateMap={updateMap}
          mapUpdated={e => this.mapUpdated()}
          highlightedEntity
          setHighlightedEntity={e => {
            this.setHighlightedEntity(e);
          }}
          backgroundURL={activeBackground}
        />
        <Menu
          settings={settings}
          setBackground={url => this.setBackground(url)}
          mapNeedsToUpdate={e => {
            this.mapNeedsToUpdate();
          }}
          setHighlightedEntity={e => {
            this.setHighlightedEntity(e);
          }}
          highlightedEntity
        />
      </div>
    );
  }
}

export default App;
