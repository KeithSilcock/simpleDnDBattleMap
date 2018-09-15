import React from "react";
import EntityStatusBar from "./entityStatusBar";

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
    const { entityList, entity } = this.props;
    const bounds =
      e.target.className === "entity"
        ? e.target.getBoundingClientRect()
        : e.target.parentElement.getBoundingClientRect();

    this.xOffset =
      bounds.width / 2 -
      (e.clientX - bounds.left + this.props.initialGridUnitSize);
    this.yOffset = bounds.bottom - e.clientY;

    for (let entityHash in entityList) {
      const entityOnMap = entityList[entityHash];

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
      //loop through entites on map and verify there aren't any positions that match this one

      for (
        let entLocIndex = 0;
        entLocIndex < this.entityLocations.length;
        entLocIndex++
      ) {
        const entLoc = this.entityLocations[entLocIndex];
        if (entLoc.x !== newXPos || entLoc.y !== newYPos) {
          //let the character move to that spot
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
        } else {
          //dont let them get there
          db.ref(`entities_on_map/${entityHash}`).update({
            ...entity,
            pos_x: this.nextPrevPos.x,
            pos_y: this.nextPrevPos.y
          });
          return;
        }
      }
    }

    console.log(newXPos, newYPos);
  }

  endDrag(e) {
    this.entityLocations = [];
  }

  render() {
    const {
      entity,
      baseEntity,
      selectedEntity,
      clearSelectedEntity
    } = this.props;

    const removeWhiteBackground = entity.is_player
      ? {}
      : {
          mixBlendMode: "multiply"
        };

    const selectedStyle = selectedEntity ? { zIndex: `5` } : null;

    const style = Object.assign({}, removeWhiteBackground, selectedStyle);

    return (
      <div className={`entity`}>
        <img
          style={style}
          draggable
          onDragStart={e => {
            this.startDragging(e);
          }}
          onDrag={e => {
            this.dragging(e);
          }}
          onDragEnd={e => {
            this.endDrag(e);
            clearSelectedEntity(e);
          }}
          className={`entity-image`}
          src={`${baseEntity.image}`}
          alt=""
        />
        <div
          style={selectedStyle}
          className="holder"
          draggable
          onDragStart={e => {
            this.startDragging(e);
          }}
          onDrag={e => {
            this.dragging(e);
          }}
          onDragEnd={e => {
            this.endDrag(e);
            clearSelectedEntity(e);
          }}
        >
          <EntityStatusBar entity={entity} baseEntity={baseEntity} />
        </div>
        <div style={selectedStyle} className="base" />
      </div>
    );
  }
}

export default Entity;
