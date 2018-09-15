import React from "react";

import "../assets/css/movementIndicator.css";

export default props => {
  const { size, col, row, distancePerBlock, currentScale, gridSize } = props;

  const movementStyle = {
    height: `${2 * size}px`,
    width: `${2 * size}px`,
    left: `${(col / distancePerBlock) * currentScale * gridSize}px`,
    top: `${(row / distancePerBlock) * currentScale * gridSize}px`
  };

  const dashStyle = {
    height: `${4 * size}px`,
    width: `${4 * size}px`,
    left: `${(col / distancePerBlock) * currentScale * gridSize}px`,
    top: `${(row / distancePerBlock) * currentScale * gridSize}px`
  };

  return (
    <div className="movementIndicator">
      <div
        style={movementStyle}
        className="movementIndicator movement-circle"
      />
      <div style={dashStyle} className="movementIndicator dash-circle" />
    </div>
  );
};
