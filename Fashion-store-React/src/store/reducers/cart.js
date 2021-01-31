import * as actionsType from '../actions/actionsType';
import rfdc from 'rfdc';

const initialState = {
    cart:[],
    totalItems:0,
    totalPrice:0,
    showCart:false,
}

const handleAddItem = (state, newItem) =>{
    const stateCopy = rfdc()(state);
    const foundItem = stateCopy.cart.find((item) =>{
        return item._id === newItem._id; 
    });
    if(!foundItem){
        newItem.quantity = 1;
        stateCopy.cart.push(newItem);
    }
    else{
        foundItem.quantity += 1;
    }
    stateCopy.totalItems += 1;
    stateCopy.totalPrice += newItem.price;
    handleLocalStorage(stateCopy);
    return stateCopy;
}

const handleLocalStorage = (stateCopy) =>{
    const item = JSON.parse(localStorage.getItem('cart'));
    item.userCart = stateCopy; 
    localStorage.setItem('cart', JSON.stringify(item));
}

const handleResetCart = () =>{
    return{
        cart:[],
        totalItems:0,
        totalPrice:0
    }
}

const handleRemoveItems = (state, items) =>{
    const stateCopy = rfdc()(state);

    const foundItem = stateCopy.cart.find((oldItems) =>{
        return items._id === oldItems._id;
    });

    const index = stateCopy.cart.findIndex((oldItems) =>{
        return items._id === oldItems._id;
    });

    stateCopy.totalItems -= foundItem.quantity;
    stateCopy.totalPrice -= (foundItem.quantity * foundItem.price);

    stateCopy.cart.splice(index, 1);
    handleLocalStorage(stateCopy);
    return stateCopy;
}

const handleRemoveItem = (state, item) =>{
    if (item.quantity === 1) {
       return handleRemoveItems(state, item)
    }
    const stateCopy = rfdc()(state);
    const foundItem = stateCopy.cart.find((oldItem) =>{
        return item._id === oldItem._id;
    });

    foundItem.quantity -= 1;
    stateCopy.totalItems -= 1;
    stateCopy.totalPrice -= foundItem.price;
    handleLocalStorage(stateCopy);
    return stateCopy;

}

const handleSetCart = (state, cart) =>{
    return {
        ...state,
        ...cart
    }
}

const handleShowCart = (state) =>{
    const stateCopy = rfdc()(state);
    return{
        ...state,
        showCart:!stateCopy.showCart
    }
}



const reducer = (state = initialState, action) =>{
    switch (action.type) {
        case actionsType.CART_ADD:
            return handleAddItem(state, action.payload.item);

        case actionsType.CART_REMOVE_ITEMS:
            return handleRemoveItems(state, action.payload.items);

        case actionsType.CART_REMOVE_ITEM:
            return handleRemoveItem(state, action.payload.item);
        
        case actionsType.CART_SET_CART:
            return handleSetCart(state, action.payload.cart);

        case actionsType.CART_SHOW_CART:
            return handleShowCart(state);
        case actionsType.CART_RESET_CART:
            return handleResetCart();
            
        default:
            return state;
    }
}

export default reducer;