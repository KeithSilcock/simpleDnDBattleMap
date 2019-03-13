import React from "react";

export default props => {
  const { entity, baseEntity } = props;

  const entityURL = entity.is_player ? entity.image : baseEntity.image;

  return <img className={`entity-image`} src={`${entityURL}`} alt="" />;
};
