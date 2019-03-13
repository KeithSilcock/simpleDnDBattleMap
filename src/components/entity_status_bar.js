import React from "react";
import { capitalizeFirstLetters } from "../helpers";

import "../assets/css/entityStatusBar.css";

class EntityStatusBar extends React.Component {
  render() {
    const { entity, baseEntity } = this.props;

    const entityName = entity.is_player
      ? baseEntity.char_name
      : baseEntity.name;

    return (
      <div className="entity-bar container">
        <div className="entity-bar name-plate">
          {capitalizeFirstLetters(entityName)}
        </div>
        <p className="entity-bar hp">
          HP: {entity.current_hp} / {baseEntity.total_hp}
        </p>
        <p className="entity-bar speed">{`Speed: ${baseEntity.speed}`}</p>
      </div>
    );
  }
}

export default EntityStatusBar;
