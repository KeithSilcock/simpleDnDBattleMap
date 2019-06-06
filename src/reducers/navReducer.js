import types from "../actions/types";

const DEFAULT_STATE = {
  left_nav_open: false,
  right_nav_open: false,
  backgrounds_menu_open: false,
  monsters_menu_open: false,
  modal_open: false,
  modal_content: null
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.TOGGLE_LEFT_NAV:
      return {
        ...state,
        left_nav_open: !state.left_nav_open,
        backgrounds_menu_open: false,
        monsters_menu_open: false
      };

    case types.TOGGLE_RIGHT_NAV:
      return {
        ...state,
        right_nav_open: !state.right_nav_open
      };

    case types.OPEN_BACKGROUNDS_MENU:
      return {
        ...state,
        backgrounds_menu_open: true,
        monsters_menu_open: false
      };
    case types.CLOSE_BACKGROUNDS_MENU:
      return {
        ...state,
        backgrounds_menu_open: false
      };

    case types.OPEN_MONSTERS_MENU:
      return {
        ...state,
        monsters_menu_open: true,
        backgrounds_menu_open: false
      };
    case types.CLOSE_MONSTERS_MENU:
      return {
        ...state,
        monsters_menu_open: false
      };

    case types.OPEN_MODAL:
      return {
        ...state,
        modal_open: true,
        modal_content: action.payload
      };
    case types.CLOSE_MODAL:
      return {
        ...state,
        modal_open: false,
        modal_content: null
      };

    default:
      return state;
  }
}
