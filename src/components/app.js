import React from "react";
import GridLayout from "./gridLayout";
import Menu from "./menu";

import "../assets/css/app.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBackground: ""
    };
  }

  setBackground(url) {
    console.log("got background", url);
    this.setState({
      ...this.state,
      currentBackground: url
    });
  }

  render() {
    const { currentBackground } = this.state;

    return (
      <div className="app-container">
        <Menu setBackground={url => this.setBackground(url)} />
        <GridLayout backgroundURL={currentBackground} />
      </div>
    );
  }
}

export default App;
