import React from "react";
import EntityStatusBar from "./entityStatusBar";

import firebaseApp from "../firebase";

import "../assets/css/entity.css";

class Entity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.xOffset = 0;
    this.yOffset = 0;
    this.lastXPos = 0;
    this.lastYPos = 0;
  }
  startDragging(e) {
    const bounds = e.target.getBoundingClientRect();
    this.xOffset = bounds.width / 2 - (e.clientX - bounds.left);
    this.yOffset = bounds.bottom - e.clientY;
  }

  dragging(e) {
    const {
      screen,
      initialGridUnitSize,
      db,
      entityHash,
      entity,
      distancePerBlock
    } = this.props;

    const newXPos = Math.floor(
      (e.clientX - screen.xMargin + this.xOffset) / initialGridUnitSize
    );
    const newYPos = Math.floor(
      (e.clientY - screen.yMargin + this.yOffset) / initialGridUnitSize
    );

    if (newXPos !== this.lastXPos || newYPos !== this.lastYPos) {
      this.lastXPos = newXPos;
      this.lastYPos = newYPos;

      //update entities on map
      db.ref(`entities_on_map/${entityHash}`).update({
        ...entity,
        pos_x: newXPos * distancePerBlock,
        pos_y: newYPos * distancePerBlock
      });
    }

    // console.log(newXPos, newYPos);
  }

  render() {
    const { entity, baseEntity } = this.props;
    const removeWhiteBackground = entity.is_player
      ? {}
      : {
          mixBlendMode: "multiply"
        };

    return (
      <div
        className="entity"
        draggable
        onDragStart={e => {
          this.startDragging(e);
        }}
        onDrag={e => {
          this.dragging(e);
        }}
        // onDragEnd={e => {
        //   this.lastXPos;
        //   this.lastYPos;
        //   e.clientX;
        //   e.clientY;
        //   debugger;
        // }}
      >
        <img
          style={removeWhiteBackground}
          className={`entity-image`}
          src={`${baseEntity.image}`}
          alt=""
        />
        <EntityStatusBar entity={entity} baseEntity={baseEntity} />
        <div className="base" />
      </div>
    );
  }
}

export default Entity;
