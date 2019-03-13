import React from "react";

import "../assets/css/movementIndicator.css";

export default props => {
  const {
    size,
    col,
    row,
    distancePerBlock,
    currentScale,
    gridSize,
    isPlayer
  } = props;

  const miscStyle = {
    left: `${(col / distancePerBlock) * currentScale * gridSize}px`,
    top: `${(row / distancePerBlock) * currentScale * gridSize}px`
  };

  const movementStyle = Object.assign(
    {},
    {
      height: `${2 * size}px`,
      width: `${2 * size}px`
    },
    miscStyle
  );

  const dashStyle = Object.assign(
    {},
    {
      height: `${4 * size}px`,
      width: `${4 * size}px`
    },
    miscStyle
  );

  const entityType = isPlayer ? "player" : "monster";

  return (
    <div className={`movementIndicator ${entityType}`}>
      <div style={miscStyle} className="movementIndicator origin" />
      <div
        style={movementStyle}
        className="movementIndicator movement-circle"
      />
      <div style={dashStyle} className="movementIndicator dash-circle" />
    </div>
  );
};
