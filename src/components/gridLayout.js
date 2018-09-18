import React from "react";
import firebaseApp from "../firebase";
import EntityImage from "./entityImage";
import Entity from "./entity";
import MovementIndicator from "./movementIndicator";

import "../assets/css/gridLayout.css";

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScale: 1,
      windowWidth: null,
      windowHeight: null,
      data: null,
      entityList: null,
      selectedEntityHash: null,
      selectedEntityLoc: {}
    };

    this.initialGridUnitSize = 50;
    this.distancePerBlock = 5;
    this.baseRef = null;
    this.entRef = null;
    this.db = firebaseApp.database();
    this.storage = firebaseApp.storage();
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });

    //pulling initial data for reference
    const BASE_PATH = `/`;
    this.baseRef = this.db.ref(BASE_PATH).once("value", snapshot => {
      const data = snapshot.val();

      this.setState({
        ...this.state,
        data
      });

      //get images
      for (
        let entityIndex = 0;
        entityIndex < Object.keys(data.entities_on_map).length;
        entityIndex++
      ) {
        const entityHash = Object.keys(data.entities_on_map)[entityIndex];
        const entity = data.entities_on_map[entityHash];

        if (entity.is_player) {
          const entityTypePath = `/${entity.base_hash}/${
            data.players[entity.base_hash].char_name
          }.png`;

          const imageURL = this.storage
            .ref(`/players`)
            .child(`${entityTypePath}`)
            .getDownloadURL()
            .then(url => {
              const { data } = this.state;

              const updatedData = {
                ...data,
                players: {
                  ...data.players,
                  [entity.base_hash]: {
                    ...data.players[entity.base_hash],
                    image: url
                  }
                }
              };

              this.setState({
                ...this.state,
                data: updatedData
              });
            });
        }
      }
    });

    //setting firebase to update entities on change
    const ENTITY_PATH = "/entities_on_map";
    this.entRef = this.db.ref(ENTITY_PATH).on("value", snapshot => {
      const entityList = snapshot.val();
      this.setState({
        ...this.state,
        entityList
      });
    });
  }

  entityDraggedOver(e) {
    //used to fix draggable items from jumping to 0,0
    e.preventDefault();
  }

  entitySelected(e, entityHash, isMoving = false) {
    const { selectedEntityHash, entityList } = this.state;

    if (entityHash !== selectedEntityHash || isMoving) {
      this.setState({
        ...this.state,
        selectedEntityHash: entityHash,
        selectedEntityLoc: {
          x: entityList[entityHash].pos_x,
          y: entityList[entityHash].pos_y
        }
      });
      return;
    }
    this.setState({
      ...this.state,
      selectedEntityHash: null,
      selectedEntityLoc: {}
    });
  }

  clearSelectedEntity(e) {
    this.setState({
      ...this.state,
      selectedEntityHash: null,
      selectedEntityLoc: {}
    });
  }

  clickedMap(e) {
    if (e.target.className === "tile") {
      this.clearSelectedEntity(e);
    }
  }

  // componentWillUnmount() {
  //   debugger;
  //   if (this.baseRef) this.baseRef.off();

  //   if (this.entRef) this.entRef.off();
  // }

  render() {
    const {
      currentScale,
      windowHeight,
      windowWidth,
      data,
      entityList,
      selectedEntityHash,
      selectedEntityLoc
    } = this.state;

    const numOfColumns = Math.floor(
      (windowWidth / this.initialGridUnitSize) * currentScale
    );
    const xMargin = Math.round(
      (((windowWidth / this.initialGridUnitSize) * currentScale -
        (numOfColumns - 1)) *
        this.initialGridUnitSize) /
        2
    );
    const numOfRows = Math.floor(
      (windowHeight / this.initialGridUnitSize) * currentScale
    );
    const yMargin = Math.round(
      (((windowHeight / this.initialGridUnitSize) * currentScale -
        (numOfRows - 1)) *
        this.initialGridUnitSize) /
        2
    );

    //create entity list
    var selectedEntityMovement = null;
    const entities =
      entityList && data
        ? Object.keys(entityList).map((entityHash, index) => {
            const entity = entityList[entityHash];
            const entityType = entity.is_player
              ? "players"
              : "monster_list_base";

            const baseEntity = data[entityType][entity.base_hash];
            const posX = (entity.pos_x / this.distancePerBlock) * currentScale;
            const posY = (entity.pos_y / this.distancePerBlock) * currentScale;

            const mapPlacement = {
              gridColumn: `${posX}`,
              gridRow: `${posY}`
            };

            const style = Object.assign({}, mapPlacement);

            //determine distance entity can move on selected
            if (selectedEntityHash === entityHash) {
              const diameterOfSpeed =
                (baseEntity.speed / this.distancePerBlock) *
                this.initialGridUnitSize *
                currentScale;

              selectedEntityMovement = (
                <MovementIndicator
                  isPlayer={entity.is_player}
                  currentScale={currentScale}
                  distancePerBlock={this.distancePerBlock}
                  col={selectedEntityLoc.x}
                  row={selectedEntityLoc.y}
                  gridSize={this.initialGridUnitSize}
                  size={diameterOfSpeed}
                />
              );
            }

            return (
              <div
                onClick={e => {
                  this.entitySelected(e, entityHash);
                }}
                className="tile entity-tile"
                style={style}
                col={posX}
                row={posY}
                key={index}
                entityname={baseEntity.name || baseEntity.char_name}
              >
                <Entity
                  selectEntity={this.entitySelected.bind(this)}
                  currentScale={currentScale}
                  clearSelectedEntity={this.clearSelectedEntity.bind(this)}
                  selectedEntityHash={selectedEntityHash}
                  entityList={entityList}
                  entityHash={entityHash}
                  distancePerBlock={this.distancePerBlock}
                  db={this.db}
                  initialGridUnitSize={this.initialGridUnitSize}
                  screen={{
                    x: windowWidth,
                    y: windowHeight,
                    xMargin,
                    yMargin
                  }}
                  entity={entity}
                  baseEntity={baseEntity}
                />
                {/* {`(${posX * 5}, ${posY * 5})`} */}
              </div>
            );
          })
        : null;

    //create grid array
    const gridArray = [];
    for (let rowIndex = 1; rowIndex < numOfRows; rowIndex++) {
      for (let columnIndex = 1; columnIndex < numOfColumns; columnIndex++) {
        //set edge case styles
        const lastRowStyle =
          rowIndex === numOfRows - 1 ? { borderBottom: "1px solid grey" } : {};
        const lastColStyle =
          columnIndex === numOfColumns - 1
            ? { borderRight: "1px solid grey" }
            : {};

        const style = Object.assign({}, lastRowStyle, lastColStyle);

        //add each item
        gridArray.push(
          <div
            style={style}
            key={`${columnIndex} ${rowIndex}`}
            className={`tile`}
            col={columnIndex}
            row={rowIndex}
          >
            {/* {`(${columnIndex * 5}, ${rowIndex * 5})`} */}
          </div>
        );
      }
    }

    //splice out all created grid divs for entities
    if (entities && entities.length) {
      //sort entities based on placement on map
      const sortedEntities = entities.sort((a, b) => {
        const aCrit = a.props.row * numOfColumns - 1 + a.props.col;
        const bCrit = b.props.row * numOfColumns - 1 + b.props.col;
        if (aCrit < bCrit) {
          return -1;
        } else if (bCrit < aCrit) {
          return 1;
        }
        return 0;
      });

      for (
        let entityIndex = 0;
        entityIndex < sortedEntities.length;
        entityIndex++
      ) {
        const entity = sortedEntities[entityIndex];

        const entity_pos =
          (numOfColumns - 1) * (entity.props.row - 1) +
          entity.props.col -
          entityIndex -
          1;
        const removedEmptyDiv = gridArray.splice(entity_pos, 1);
      }
    }

    const gridContainerLayout = {
      gridTemplateColumns: `repeat(${numOfColumns - 1}, ${this
        .initialGridUnitSize * currentScale}px)`,
      gridTemplateRows: `repeat(${numOfRows - 1}, ${this.initialGridUnitSize *
        currentScale}px)`,
      margin: `${yMargin}px ${xMargin}px`
    };

    return (
      <div
        onClick={e => {
          this.clickedMap(e);
        }}
        style={gridContainerLayout}
        onDragOver={e => {
          this.entityDraggedOver(e);
        }}
        className="grid-container"
      >
        {gridArray}
        {entities}
        {selectedEntityMovement}
      </div>
    );
  }
}

export default GridLayout;
