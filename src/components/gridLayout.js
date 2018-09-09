import React from "react";

import "../assets/css/gridLayout.css";

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScale: 1,
      windowWidth: null,
      windowHeight: null
    };

    this.initialGridUnitSize = 50;
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  render() {
    const { currentScale, windowHeight, windowWidth } = this.state;

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

    const gridArray = [];
    for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < numOfColumns; columnIndex++) {
        //add each item
        gridArray.push(<div>{`(${columnIndex}, ${rowIndex})`}</div>);
      }
    }

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
      </div>
    );
  }
}

export default GridLayout;
