import React from "react";

import { connect } from "react-redux";
import {
  openBackgroundsMenu,
  closeBackgroundsMenu,
  openModal,
  closeModal
} from "../../actions";

import firebaseApp from "../../firebase";

class Background extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: {},
      // modal_open: false,
      modal_data: {
        html: "",
        buttons: ""
      },
      new_file_data: {
        name: "",
        url: "",
        file: null
      }
    };

    this.storage = firebaseApp.storage();
    this.db = firebaseApp.database();
  }

  componentDidMount() {
    this.updateBackgroundList();
  }

  updateBackgroundList() {
    this.db.ref("terrains").once("value", snapshot => {
      const data = snapshot.val();
      this.setState({
        ...this.state,
        backgrounds: data
      });
    });
  }

  createBackgroundsList() {
    const { setBackground } = this.props;
    const { backgrounds } = this.state;

    return Object.keys(backgrounds).map((background_hash, index) => {
      let background = backgrounds[background_hash];

      return (
        <li
          key={index}
          className="background-element"
          onClick={e => {
            e.stopPropagation();
            setBackground(background.url);
          }}
        >
          <div className="element-name">Name: {background.name}</div>
          <img className="element-image" src={background.url} alt="" />
        </li>
      );
    });
  }

  toggle_backgrounds_menu(e) {
    const { background_menu_open } = this.props;

    if (background_menu_open) {
      return this.props.closeBackgroundsMenu();
    }
    this.props.openBackgroundsMenu();
  }

  changeNewBackgroundName(e) {
    const { new_file_data } = this.state;
    const { value } = e.target;

    this.setState({
      ...this.state,
      new_file_data: {
        ...new_file_data,
        name: value
      }
    });
  }

  confirmUpload(e) {
    const file = e.target.files[0];
    const { new_file_data } = this.state;

    const modal_html = (
      <div className="upload-file-modal">
        <label htmlFor="background_name">Background Name: </label>
        <input
          onChange={e => this.changeNewBackgroundName(e)}
          name="background_name"
          type="text"
        />
      </div>
    );

    this.setState(
      {
        ...this.state,
        new_file_data: {
          ...new_file_data,
          file
        }
      },
      () => {
        const data = {
          html: modal_html,
          submit: () => this.uploadBackground
        };
        this.props.openModal(data);
      }
    );
  }

  uploadBackground() {
    const { new_file_data } = this.state;

    const storage_ref = this.storage.ref(`/terrains/${new_file_data.name}`);
    //upload image
    storage_ref.put(new_file_data.file).then(image_upload_snapshot => {
      //get new url:
      image_upload_snapshot.ref.getDownloadURL().then(downloadURL => {
        //update database
        this.db
          .ref("/terrains")
          .push()
          .set({
            name: new_file_data.name,
            url: downloadURL
          })
          .then(db_terrain_snapshot => {
            //finally, update state
            this.setState(
              {
                ...this.state,
                new_file_data: {
                  ...new_file_data,
                  url: downloadURL
                }
              },
              () => {
                this.updateBackgroundList();
                this.props.closeModal();
              }
            );
          });
      });
    });
  }

  render() {
    // const { modal_open, modal_data } = this.state;
    const { background_menu_open } = this.props;

    const backgrounds_menu = background_menu_open ? (
      <div
        onClick={e => e.stopPropagation()}
        className="backgrounds-list-container"
      >
        <label htmlFor="background">Upload a background: </label>
        <input
          onChange={e => {
            this.confirmUpload(e);
          }}
          type="file"
          id="background-file-upload-button"
          name="background"
          accept="image/*"
        />
        <ul className="backgrounds-list">{this.createBackgroundsList()}</ul>
      </div>
    ) : (
      ""
    );

    return (
      <li
        className="menu-item"
        onClick={e => {
          this.toggle_backgrounds_menu(e);
        }}
      >
        Background stuff
        {backgrounds_menu}
      </li>
    );
  }
}

function mapStateToProps(state) {
  return {
    background_menu_open: state.navData.backgrounds_menu_open
  };
}
export default connect(
  mapStateToProps,
  { openBackgroundsMenu, closeBackgroundsMenu, openModal, closeModal }
)(Background);
