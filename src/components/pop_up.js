import React from "react";

import "../assets/css/modal.css";

export default props => {
  const { html, submit_function, buttons, close_function } = props;

  const display_buttons = buttons ? (
    buttons
  ) : (
    <div className="modal_buttons">
      <button onClick={e => submit_function(e)}>Submit</button>
      <button onClick={e => close_function(e)}>Close</button>
    </div>
  );

  return (
    <div
      id="modal_container"
      className="modal-container"
      onClick={e => {
        e.stopPropagation();
        close_function(e);
      }}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {html}
        {display_buttons}
      </div>
      <div className="modal-background" />
    </div>
  );
};
