import React from "react";

import { connect } from "react-redux";
import { closeModal } from "../actions";

import "../assets/css/modal.css";

class PopUp extends React.Component {
  render() {
    const { html, submit, buttons } = this.props.data;
    console.log("submit", submit);

    const display_buttons = buttons ? (
      buttons
    ) : (
      <div className="modal_buttons">
        <button
          onClick={e => {
            submit(e);
          }}
        >
          Submit
        </button>
        <button onClick={e => this.props.closeModal(e)}>Close</button>
      </div>
    );

    return (
      <div
        id="modal_container"
        className="modal-container"
        onClick={e => {
          e.stopPropagation();
          this.props.closeModal(e);
        }}
      >
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {html}
          {display_buttons}
        </div>
        <div className="modal-background" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default connect(
  mapStateToProps,
  { closeModal }
)(PopUp);
