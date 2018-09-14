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
    this.prevPos = { x: 0, y: 0 };
    this.nextPrevPos = { x: 0, y: 0 };
    this.lastXPos = 0;
    this.lastYPos = 0;
    this.entityLocations = [];
  }
  startDragging(e) {
    const { data, entity } = this.props;
    const bounds =
      e.target.className === "entity"
        ? e.target.getBoundingClientRect()
        : e.target.parentElement.getBoundingClientRect();

    this.xOffset =
      bounds.width / 2 -
      (e.clientX - bounds.left + this.props.initialGridUnitSize);
    this.yOffset = bounds.bottom - e.clientY;

    for (let entityHash in data.entities_on_map) {
      const entityOnMap = data.entities_on_map[entityHash];

      if (entityOnMap.base_hash !== entity.base_hash) {
        this.entityLocations.push({
          x: entityOnMap.pos_x,
          y: entityOnMap.pos_y
        });
      }
    }
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

    const newXPos =
      Math.floor(
        (e.clientX - screen.xMargin + this.xOffset) / initialGridUnitSize
      ) * distancePerBlock;
    const newYPos =
      Math.floor(
        (e.clientY - screen.yMargin + this.yOffset) / initialGridUnitSize
      ) * distancePerBlock;

    if (newXPos !== this.prevPos.x || newYPos !== this.prevPos.y) {
      this.nextPrevPos = {
        x: this.prevPos.x,
        y: this.prevPos.y
      };
      this.prevPos = {
        x: newXPos,
        y: newYPos
      };

      //update entities on map
      db.ref(`entities_on_map/${entityHash}`).update({
        ...entity,
        pos_x: newXPos,
        pos_y: newYPos
      });
    }

    console.log(newXPos, newYPos);
  }

  checkOverlap(e) {
    const { db, entity, entityHash } = this.props;
    //loop through entites on map and verify there aren't any positions that match this one
    for (
      let entLocIndex = 0;
      entLocIndex < this.entityLocations.length;
      entLocIndex++
    ) {
      const entLoc = this.entityLocations[entLocIndex];
      if (entLoc.x === this.prevPos.x && entLoc.y === this.prevPos.y) {
        db.ref(`entities_on_map/${entityHash}`).update({
          ...entity,
          pos_x: this.nextPrevPos.x,
          pos_y: this.nextPrevPos.y
        });
        this.entityLocations = [];

        return;
      }
    }
  }

  render() {
    const { entity, baseEntity } = this.props;
    const removeWhiteBackground = entity.is_player
      ? {}
      : {
          mixBlendMode: "multiply"
        };

    return (
      <div className="entity">
        <img
          draggable
          onDragStart={e => {
            this.startDragging(e);
          }}
          onDrag={e => {
            this.dragging(e);
          }}
          onDragEnd={e => {
            this.checkOverlap(e);
          }}
          style={removeWhiteBackground}
          className={`entity-image`}
          src={`${baseEntity.image}`}
          alt=""
        />
        <div
          className="holder"
          draggable
          onDragStart={e => {
            this.startDragging(e);
          }}
          onDrag={e => {
            this.dragging(e);
          }}
          onDragEnd={e => {
            this.checkOverlap(e);
          }}
        >
          <EntityStatusBar entity={entity} baseEntity={baseEntity} />
        </div>
        <div className="base" />
      </div>
    );
  }
}

export default Entity;
