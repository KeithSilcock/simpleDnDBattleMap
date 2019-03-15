import types from "./types";
import db from "../firebase";

// export const getData = () => async dispatch => {
//   const path = "/boards";
//   await db.ref(path).on("value", snapshot => {
//     const data = snapshot.val();
//     dispatch({
//       type: types.GET_DATA,
//       payload: data
//     });
//   });
// };

export function toggleLeftNav() {
  return {
    type: types.TOGGLE_LEFT_NAV
  };
}
export function toggleRightNav() {
  return {
    type: types.TOGGLE_RIGHT_NAV
  };
}
export function openBackgroundsMenu() {
  return {
    type: types.OPEN_BACKGROUNDS_MENU
  };
}
export function closeBackgroundsMenu() {
  return {
    type: types.CLOSE_BACKGROUNDS_MENU
  };
}

export function openMonstersMenu() {
  return {
    type: types.OPEN_MONSTERS_MENU
  };
}
export function closeMonstersMenu() {
  return {
    type: types.CLOSE_MONSTERS_MENU
  };
}

export function openModal(modal_content) {
  return {
    type: types.OPEN_MODAL,
    payload: modal_content
  };
}
export function closeModal() {
  return {
    type: types.CLOSE_MODAL
  };
}

// export function changLocation(newUrl) {
//   return {
//     type: types.TOGGLE_MODAL,
//     payload: newUrl
//   };
// }
