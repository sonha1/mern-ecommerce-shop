import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );
      // state.cartItems.map((i) => {
      //   if (i.product === item.product) {
      //     console.log(i.quantity);
      //   }
      // });
      if (isItemExist) {
        return {
          ...state,

          cartItems: state.cartItems.map((i) =>
            //  i.product === isItemExist.product ? item : i

            {
              if (i.product === isItemExist.product) {
                // console.log(i);

                i.quantity += item.quantity;
                return i;
                // console.log(i);
              }
              return i;
            }
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (i) => i.product !== action.payload
        ),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
