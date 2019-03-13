import React from "react";
import EntityStatusBar from "./entity_status_bar";
import { distanceBetweenTwoPoints } from "../helpers";

import "../assets/css/entity.css";

class Entity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.xOffset = 0;
    this.xStart = 0;
    this.yStart = 0;
    this.yOffset = 0;
    this.prevPos = { x: 0, y: 0 };
    this.nextPrevPos = { x: 0, y: 0 };
    this.lastXPos = 0;
    this.lastYPos = 0;
    this.entityLocations = [];
    this.justStartedDragging = false;
    this.ent_loc = null;
  }

  componentDidMount() {
    const { entity } = this.props;
    this.prevPos = { x: entity.pos_x, y: entity.pos_y };
  }

  componentDidUpdate() {
    this.ent_loc = this.ent.getBoundingClientRect();
  }

  startDragging(e) {
    const { entityList, entity, selectEntity, entityHash } = this.props;

    console.log("Entity location: ", this.ent_loc);
    this.xStart = e.clientX;
    console.log("start: ", this.prevPos.x);
    this.yStart = e.clientY;
    this.justStartedDragging = true;

    //select the entity
    selectEntity(e, entityHash, true);

    this.xOffset = this.ent_loc.left - e.clientX;
    this.yOffset = this.ent_loc.bottom - e.clientY - this.props.offset.y;

    this.xStart = e.clientX + this.xOffset;
    this.yStart = e.clientY + this.yOffset;

    for (let uniqueEntityHash in entityList) {
      const entityOnMap = entityList[uniqueEntityHash];

      if (uniqueEntityHash !== entityHash) {
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
    // console.log("clientx: ", e.clientX);

    if (this.justStartedDragging) {
      var clientX = this.xStart;
      var clientY = this.yStart;
      this.justStartedDragging = false;
    } else {
      var clientX = e.clientX + this.xOffset;
      var clientY = e.clientY + this.yOffset;
    }
    const newXPos =
      Math.floor(clientX / initialGridUnitSize) * distancePerBlock;
    const newYPos =
      Math.floor(clientY / initialGridUnitSize) * distancePerBlock;

    if (newXPos !== this.prevPos.x || newYPos !== this.prevPos.y) {
      //check to make sure the position isn't off the map
      if (newXPos <= 0 || newYPos <= 0) {
        return;
      }
      // if (Math.abs(newXPos - this.prevPos.x) > 3 * distancePerBlock) {
      //   console.log(
      //     "new x pos: ",
      //     newXPos,
      //     "...prev pos: ",
      //     this.prevPos.x,
      //     "... math check",
      //     Math.abs(newXPos - this.prevPos.x)
      //   );

      //   return;
      // }
      // if (Math.abs(newYPos - this.prevPos.Y) > 3 * distancePerBlock) {
      //   console.log("got here 2");

      //   return;
      // }

      //loop through entites on map and verify there aren't any positions that match this one
      for (
        let entLocIndex = 0;
        entLocIndex < this.entityLocations.length;
        entLocIndex++
      ) {
        const entLoc = this.entityLocations[entLocIndex];
        if (entLoc.x === newXPos && entLoc.y === newYPos) {
          // dont let the character move to that spot
          return;
        }
      }
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
  }

  endDrag(e) {
    this.entityLocations = [];
  }

  render() {
    const {
      entity,
      baseEntity,
      selectedEntityHash,
      clearSelectedEntity,
      entityHash,
      entityList,
      currentScale
    } = this.props;

    const entityType = entity.is_player ? "player" : "monster";
    const removeWhiteBackground = entity.is_player
      ? {}
      : {
          mixBlendMode: "multiply"
        };

    const selectedStyle =
      selectedEntityHash === entityHash ? { zIndex: `5` } : null;

    const selectedEntityEnlargementStyle =
      selectedEntityHash === entityHash
        ? {
            width: `${200 * currentScale}px`,
            transform: "translate(-25%)"
          }
        : {};

    const style = Object.assign(
      {},
      // removeWhiteBackground,
      selectedStyle,
      selectedEntityEnlargementStyle
    );

    let distanceToSelectedEntity = null;
    if (selectedEntityHash && selectedEntityHash !== entityHash) {
      const selectedEntity = entityList[selectedEntityHash];
      distanceToSelectedEntity = Math.floor(
        distanceBetweenTwoPoints(selectedEntity, entity)
      );
    }

    return (
      <div className={`entity ${entityType}`} ref={b => (this.ent = b)}>
        HERE I AM!
        {distanceToSelectedEntity ? (
          <div className="distance container">{`${distanceToSelectedEntity} ft`}</div>
        ) : null}
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
