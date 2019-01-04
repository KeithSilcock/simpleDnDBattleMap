import React from "react";
import PopUp from "../pop_up";

import firebaseApp from "../../firebase";

class Background extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      background_menu_open: false,
      backgrounds: {},
      modal_open: false,
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

  toggleBackgroundTab(e) {
    e.stopPropagation();
    const { background_menu_open } = this.state;

    console.log("setting background window to: ", !background_menu_open);

    if (background_menu_open) {
      this.closeBackgroundsTab();
      return;
    }
    this.openBackgroundsTab();
  }
  openBackgroundsTab() {
    this.setState({
      ...this.state,
      background_menu_open: true
    });
  }
  closeBackgroundsTab() {
    this.setState({
      ...this.state,
      background_menu_open: false
    });
  }
  close_popup(e) {
    this.setState({
      ...this.state,
      modal_open: false
    });
  }
  open_popup(html, buttons) {
    this.setState({
      ...this.state,
      modal_open: true,
      modal_data: {
        html,
        buttons
      }
    });
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
        this.open_popup(modal_html);
        console.log(file);
      }
    );
  }

  uploadBackground() {
    const { new_file_data } = this.state;

    console.log(new_file_data);

    const storage_ref = this.storage.ref(`/terrains/${new_file_data.name}`);
    //upload image
    storage_ref.put(new_file_data.file).then(image_upload_snapshot => {
      //get new url:
      image_upload_snapshot.ref.getDownloadURL().then(downloadURL => {
        //update database
        console.log("added photo at: ", downloadURL);
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
                this.close_popup();
              }
            );
          });
      });
    });
  }

  render() {
    const { background_menu_open, modal_open, modal_data } = this.state;

    const modal_display = modal_open ? (
      <PopUp
        close_function={e => this.close_popup(e)}
        submit_function={() => this.uploadBackground()}
        html={modal_data.html}
        buttons={modal_data.buttons}
      />
    ) : (
      ""
    );

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
          this.toggleBackgroundTab(e);
        }}
      >
        Background stuff
        {backgrounds_menu}
        {modal_display}
      </li>
    );
  }
}

export default Background;
