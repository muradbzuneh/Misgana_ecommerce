import { type } from "./actionType";

export const initialState = {
  basket: [],
  user: null,
  searchTerm: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case type.ADD_TO_CART:
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    case type.REMOVE_FROM_CART: {
      const index = state.basket.findIndex(
        (item) => item.id === action.item.id,
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      }

      return {
        ...state,
        basket: newBasket,
      };
    }
    case type.BUY_NOW:
      return {
        ...state,
        basket: [action.item],
      };

    case type.REMOVE_ITEM_COMPLETELY: 
    {
      const filteredBasket = state.basket.filter(
        (item) => item.id !== action.item.id,
      );

      return {
        ...state,
        basket: filteredBasket,
      };
    }
    case type.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case type.EMPTY_CART:
      return {
        ...state,
        basket: [],
      };
    case type.SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    default:
      return state;
  }
};
