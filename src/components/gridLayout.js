import React from "react";
import firebaseApp from "../firebase";
import EntityImage from "./entityImage";
import Entity from "./entity";

import "../assets/css/gridLayout.css";

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScale: 1,
      windowWidth: null,
      windowHeight: null,
      data: null,
      entityList: null
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
      entityList
    } = this.state;

    const numOfColumns = Math.floor(
      (windowWidth / this.initialGridUnitSize) * currentScale
    );
    const xMargin = Math.round(
      ((windowWidth / this.initialGridUnitSize) * currentScale - numOfColumns) *
        this.initialGridUnitSize
    );
    const numOfRows = Math.floor(
      (windowHeight / this.initialGridUnitSize) * currentScale
    );
    const yMargin = Math.round(
      ((windowHeight / this.initialGridUnitSize) * currentScale - numOfRows) *
        this.initialGridUnitSize
    );

    //create entity list
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

            return (
              <div
                className="entity-tile"
                style={style}
                col={posX}
                row={posY}
                key={index}
                entityname={baseEntity.name || baseEntity.char_name}
              >
                <Entity
                  entityHash={entityHash}
                  distancePerBlock={this.distancePerBlock}
                  db={this.db}
                  initialGridUnitSize={this.initialGridUnitSize}
                  screen={{ x: windowWidth, y: windowHeight, xMargin, yMargin }}
                  entity={entity}
                  baseEntity={baseEntity}
                />
                {`(${posX}, ${posY})`}
              </div>
            );
          })
        : null;

    //create grid array
    const gridArray = [];
    for (let rowIndex = 1; rowIndex < numOfRows; rowIndex++) {
      for (let columnIndex = 1; columnIndex < numOfColumns; columnIndex++) {
        //add each item
        gridArray.push(
          <div
            key={`${columnIndex} ${rowIndex}`}
            className={`tile`}
            col={columnIndex}
            row={rowIndex}
          >{`(${columnIndex}, ${rowIndex})`}</div>
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
        style={gridContainerLayout}
        onDragOver={e => {
          this.entityDraggedOver(e);
        }}
        className="grid-container"
      >
        {gridArray}
        {entities}
        {/* {me} */}
      </div>
    );
  }
}

export default GridLayout;
