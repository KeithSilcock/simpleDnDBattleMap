import React from "react";
import PopUp from "../pop_up";
import Entity from "../entity";

import firebaseApp from "../../firebase";

class MonsterMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      monster_menu_open: false,
      monsters: {},
      modal_open: false,
      modal_data: {
        html: "",
        buttons: ""
      },
      new_monster_data: {
        name: "",
        image: "",
        total_hp: "",
        desc: "",
        speed: "",
        size: "",
        file: null
      }
    };

    this.storage = firebaseApp.storage();
    this.db = firebaseApp.database();
  }

  componentDidMount() {
    this.updateMonsterList();
  }

  updateMonsterList() {
    this.db.ref("monster_list_base").once("value", snapshot => {
      const monsters = snapshot.val();
      this.setState({
        ...this.state,
        monsters: monsters
      });
    });
  }
  createMonstersList() {
    const { monsters } = this.state;

    return Object.keys(monsters).map((monster_hash, index) => {
      let monster = monsters[monster_hash];

      return (
        <li
          key={index}
          className="monster-element"
          onClick={e => {
            e.stopPropagation();
            this.addEntityToMap(monster_hash);
          }}
        >
          <div className="element-name">Name: {monster.name}</div>
          <div className="element-hp">HP: {monster.total_hp}</div>
          <img className="element-image" src={monster.image} alt="" />
        </li>
      );
    });
  }

  toggleMonsterTab(e) {
    e.stopPropagation();
    const { monster_menu_open } = this.state;

    if (monster_menu_open) {
      this.closemonstersTab();
      return;
    }
    this.openmonstersTab();
  }
  openmonstersTab() {
    this.setState({
      ...this.state,
      monster_menu_open: true
    });
  }
  closemonstersTab() {
    this.setState({
      ...this.state,
      monster_menu_open: false
    });
  }

  close_popup(e) {
    this.setState({
      ...this.state,
      modal_open: false
    });
  }

  setMonsterImage(e) {
    const { new_monster_data } = this.state;
    const file = e.target.files[0];
    this.setState({
      ...this.state,
      new_monster_data: {
        ...new_monster_data,
        file
      }
    });
  }

  open_popup() {
    const { new_monster_data } = this.state;
    const { name, desc, size, speed, total_hp } = new_monster_data;

    const modal_html = (
      <div className="upload-file-modal">
        <div className="monster-info">
          <label htmlFor="image">Upload a beast image: </label>
          <input
            onChange={e => {
              this.setMonsterImage(e);
            }}
            type="file"
            id="monster-image-upload-button"
            name="image"
            accept="image/*"
          />

          <label htmlFor="name">Monster Name: </label>
          <input
            onChange={e => this.changeNewMonsterStats(e)}
            name="name"
            // value={name}
            type="text"
          />

          <label htmlFor="desc">Monster Description: </label>
          <input
            onChange={e => this.changeNewMonsterStats(e)}
            name="desc"
            // value={desc}
            type="text"
          />

          <label htmlFor="total_hp">Monster HP: </label>
          <input
            onChange={e => this.changeNewMonsterStats(e)}
            name="total_hp"
            // value={total_hp}
            type="text"
          />

          <label htmlFor="speed">Monster Speed:</label>
          <input
            onChange={e => this.changeNewMonsterStats(e)}
            name="speed"
            // value={speed}
            type="text"
          />

          <label htmlFor="size">
            Monster Size{" "}
            <i
              className="fas fa-info-circle"
              title="Most monsters are size 1. Ask Keith if they need to be bigger."
            />
            :{" "}
          </label>
          <input
            onChange={e => this.changeNewMonsterStats(e)}
            name="size"
            // value={size}
            type="text"
          />
        </div>
      </div>
    );

    this.setState({
      ...this.state,
      modal_open: true,
      modal_data: {
        html: modal_html
      }
    });
  }
  changeNewMonsterStats(e) {
    const { new_monster_data } = this.state;
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      new_monster_data: {
        ...new_monster_data,
        [name]: value
      }
    });
  }

  confirmUpload(e) {
    const { new_monster_data } = this.state;

    const storage_ref = this.storage.ref(`/monsters/${new_monster_data.name}`);
    //upload image
    storage_ref.put(new_monster_data.file).then(image_upload_snapshot => {
      //get new url:
      image_upload_snapshot.ref.getDownloadURL().then(downloadURL => {
        //update database
        const newEntRef = this.db.ref("monster_list_base").push();
        newEntRef.set(
          {
            ...new_monster_data,
            image: downloadURL
          },
          () => {
            this.updateMonsterList();
            this.close_popup();
          }
        );
      });
    });
  }

  addEntityToMap(entityHash) {
    const { monsters } = this.state;

    const newEntRef = this.db.ref("entities_on_map").push();

    newEntRef.set({
      base_hash: entityHash,
      current_hp: monsters[entityHash].total_hp,
      is_player: false,
      pos_x: 5,
      pos_y: 5,
      status_effect: "none"
    });
    this.props.mapNeedsToUpdate();
  }

  render() {
    const { monster_menu_open, modal_open, modal_data } = this.state;

    const modal_display = modal_open ? (
      <PopUp
        close_function={e => this.close_popup(e)}
        submit_function={() => this.confirmUpload()}
        html={modal_data.html}
        buttons={modal_data.buttons}
      />
    ) : (
      ""
    );

    const monsters_menu = monster_menu_open ? (
      <div
        onClick={e => e.stopPropagation()}
        className="monsters-list-container"
      >
        <button className="new-monster" onClick={e => this.open_popup()}>
          New Monster
        </button>
        <ul className="monsters-list">{this.createMonstersList()}</ul>
      </div>
    ) : (
      ""
    );

    return (
      <li
        className="menu-item"
        onClick={e => {
          this.toggleMonsterTab(e);
        }}
      >
        Monsters
        {monsters_menu}
        {modal_display}
      </li>
    );
  }
}

export default MonsterMenu;
