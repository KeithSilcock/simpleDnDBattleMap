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
    this.dragCount = 0;
    this.ent_loc = null;
  }

  componentDidMount() {
    const { entity } = this.props;
    this.prevPos = { x: entity.pos_x, y: entity.pos_y };
    this.dragImg = new Image(0, 0);
    this.dragImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }

  componentDidUpdate() {
    this.ent_loc = this.ent.getBoundingClientRect();
  }

  startDragging(e) {
    const { entityList, entity, selectEntity, entityHash } = this.props;

    selectEntity(e, entityHash, true);

    // remove ghost image on drag
    e.dataTransfer.setDragImage(this.dragImg, 0, 0);

    // console.log("Entity location: ", this.ent_loc);
    // this.xStart = e.clientX;
    // console.log("start: ", this.prevPos.x);
    // this.yStart = e.clientY;
    // this.justStartedDragging = true;

    //select the entity
    // selectEntity(e, entityHash, true);
    this.xOffset = -this.props.offset.x;
    this.yOffset = -this.props.offset.y;

    // this.xStart = e.clientX + this.xOffset + window.scrollX;
    // this.yStart = e.clientY + this.yOffset + window.scrollY;

    for (let uniqueEntityHash in entityList) {
      const entityOnMap = entityList[uniqueEntityHash];

      if (uniqueEntityHash !== entityHash) {
        this.entityLocations.push({
          x: entityOnMap.pos_x,
          y: entityOnMap.pos_y,
        });
      }
    }
  }

  dragging(e) {
    if (this.dragCount > 3) {
      const { screen, initialGridUnitSize, db, entityHash, entity, distancePerBlock } = this.props;

      // if (this.justStartedDragging) {
      //   var clientX = this.xStart;
      //   var clientY = this.yStart;
      //   this.justStartedDragging = false;
      // } else {
      var clientX = e.clientX + this.xOffset + window.scrollX;
      var clientY = e.clientY + this.yOffset + window.scrollY;

      // }
      const newXPos = Math.floor(clientX / initialGridUnitSize) * distancePerBlock;
      const newYPos = Math.floor(clientY / initialGridUnitSize) * distancePerBlock;

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
        // also check, if there are some nearby others, their images need to be fixed.
        for (let entLocIndex = 0; entLocIndex < this.entityLocations.length; entLocIndex++) {
          const entLoc = this.entityLocations[entLocIndex];
          if (entLoc.x === newXPos && entLoc.y === newYPos) {
            // dont let the character move to that spot
            return;
          } else if (newXPos - entLoc.x === distancePerBlock && newYPos - entLoc.y === distancePerBlock) {
            console.log("NEAR OTHER ENTITY");
          }
        }
        this.nextPrevPos = {
          x: this.prevPos.x,
          y: this.prevPos.y,
        };
        this.prevPos = {
          x: newXPos,
          y: newYPos,
        };

        //update entities on map
        db.ref(`entities_on_map/${entityHash}`).update({
          ...entity,
          pos_x: newXPos,
          pos_y: newYPos,
        });
      }
    }
    this.dragCount += 1;
  }

  endDrag(e) {
    this.entityLocations = [];
    this.dragCount = 0;
  }

  render() {
    const { entity, baseEntity, selectedEntityHash, clearSelectedEntity, entityHash, entityList, currentScale } = this.props;

    const entityType = entity.is_player ? "player" : "monster";
    const removeWhiteBackground = entity.is_player
      ? {}
      : {
          mixBlendMode: "multiply",
        };

    const selectedStyle = selectedEntityHash === entityHash ? { zIndex: `5`, opacity: 0.75 } : null;

    const selectedEntityEnlargementStyle =
      selectedEntityHash === entityHash
        ? {
            width: `${200 * currentScale}px`,
            transform: "translate(-25%)",
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
      distanceToSelectedEntity = Math.floor(distanceBetweenTwoPoints(selectedEntity, entity));
    }

    const displayStats = entityHash !== selectedEntityHash ? <EntityStatusBar entity={entity} baseEntity={baseEntity} /> : "";

    return (
      <div className={`entity ${entityType}`} ref={(b) => (this.ent = b)}>
        {distanceToSelectedEntity ? <div className="distance-container">{`${distanceToSelectedEntity} ft`}</div> : null}
        <img
          style={style}
          draggable
          onMouseDown={(e) => console.log("Clicked img!")}
          onDragStart={(e) => {
            this.startDragging(e);
          }}
          onDrag={(e) => {
            this.dragging(e);
          }}
          onDragEnd={(e) => {
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
          onMouseDown={(e) => {
            console.log("Clicked: ", e.clientX);
          }}
          onDragStart={(e) => {
            this.startDragging(e);
          }}
          onDrag={(e) => {
            this.dragging(e);
          }}
          onDragEnd={(e) => {
            this.endDrag(e);
            clearSelectedEntity(e);
          }}
        >
          {displayStats}
        </div>
        <div style={selectedStyle} className="base" />
      </div>
    );
  }
}

export default Entity;
