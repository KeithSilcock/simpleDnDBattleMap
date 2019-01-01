import React from "react";

class Background extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
  }

  createBackgroundsList() {
    const { backgrounds, setBackground } = this.props;
    console.log("backgrounds: ", backgrounds);

    return Object.keys(backgrounds).map((background_hash, index) => {
      let background = backgrounds[background_hash];

      return (
        <li
          key={index}
          className="background-element"
          onClick={e => setBackground(background.url)}
        >
          <div className="element-name">Name: {background.name}</div>
          <img className="element-image" src={background.url} alt="" />
        </li>
      );
    });
  }

  render() {
    const { opened } = this.state;

    const backgrounds_menu = opened ? (
      <div className="backgrounds-list-container">
        <ul className="backgrounds-list">{this.createBackgroundsList()}</ul>
      </div>
    ) : (
      ""
    );

    return (
      <li
        className="menu-item"
        onClick={() => {
          console.log("setting background window to: ", opened);
          this.setState({
            ...this.state,
            opened: !opened
          });
        }}
      >
        Background stuff
        {backgrounds_menu}
      </li>
    );
  }
}

export default Background;
