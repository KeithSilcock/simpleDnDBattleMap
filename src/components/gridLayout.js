import React from "react";
import firebase from "../firebase";

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
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });

    //pulling initial data for reference
    const BASE_PATH = `/`;
    firebase.ref(BASE_PATH).on("value", snapshot => {
      const data = snapshot.val();
      this.setState({
        ...this.state,
        data,
        entityList: data.entities_on_map
      });
    });

    //setting firebase to update entities on change
    const ENTITY_PATH = "/entities_on_map";
    firebase.ref(ENTITY_PATH).on("child_changed", snapshot => {
      const newEntityList = snapshot.val();
      debugger;
    });
  }

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
    const entities = entityList
      ? Object.keys(entityList).map((entityIndex, index) => {
          const entity = entityList[entityIndex];

          const entityType = entity.is_player ? "players" : "monster_list_base";
          const posX = (entity.pos_x / this.distancePerBlock) * currentScale;
          const posY = (entity.pos_y / this.distancePerBlock) * currentScale;

          const mapPlacement = {
            gridColumn: `${posX}`,
            gridRow: `${posY}`
          };

          return (
            <div
              style={mapPlacement}
              col={posX}
              row={posY}
              key={index}
              className="entity"
            >
              <span>
                HP: {entity.current_hp} /{" "}
                {data[entityType][entity.base_hash].total_hp}
              </span>
              <div className="base" />
            </div>
          );
        })
      : null;

    //create grid array
    const gridArray = [];
    for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
        //add each item
        gridArray.push(
          <div
            className={`tile`}
            col={columnIndex}
            row={rowIndex}
          >{`(${columnIndex}, ${rowIndex})`}</div>
        );
      }
    }

    //splice out all created grid divs for entities
    if (entities && entities.length) {
      for (let entityIndex = 0; entityIndex < entities.length; entityIndex++) {
        const entity = entities[entityIndex];

        const entity_pos =
          (numOfColumns - 1) * (entity.props.row - 1) + entity.props.col;
        const removedEmptyDiv = gridArray.splice(entity_pos, 1);
      }
    }

    // const meStyle = {
    //   gridColumn: "5",
    //   gridRow: "1"
    // };
    // const me = (
    //   <div style={meStyle} className="me">
    //     keith
    //   </div>
    // );

    const gridContainerLayout = {
      gridTemplateColumns: `repeat(${numOfColumns}, ${this.initialGridUnitSize *
        currentScale}px)`,
      gridTemplateRows: `repeat(${numOfRows}, ${this.initialGridUnitSize *
        currentScale}px)`,
      margin: `${yMargin / 2}px ${xMargin / 2}px`
    };

    return (
      <div style={gridContainerLayout} className="grid-container">
        {gridArray}
        {entities}
        {/* {me} */}
      </div>
    );
  }
}

export default GridLayout;
