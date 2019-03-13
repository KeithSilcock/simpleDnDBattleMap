import React from "react";

import firebaseApp from "../../firebase";

class PlayersInGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted_character: null,
      characters: {}
    };
    this.db = firebaseApp.database();
    this.storage = firebaseApp.storage();
    this.setEntity = this.props.setHighlightedEntity;
  }

  componentDidMount() {
    this.db.ref("players").once("value", snapshot => {
      this.setState({
        ...this.state,
        characters: snapshot.val()
      });
    });
  }

  createCharacterPortraits() {
    const { characters } = this.state;

    if (Object.keys(characters).length) {
      return Object.keys(characters).map((characterName, index) => {
        const character = characters[characterName];
        return (
          <li key={index} className="character-portrait">
            <img src={character.image} alt="" />
            <p className="char_name">
              <strong>{character.char_name}</strong>
            </p>
            <p className="hp">hp: {character.hp}</p>
          </li>
        );
      });
    }
    return "";
  }

  render() {
    const { characters } = this.state;

    return (
      <div className="character-tab">
        Characters:
        <ul className="character-list">{this.createCharacterPortraits()}</ul>
      </div>
    );
  }
}

export default PlayersInGame;
