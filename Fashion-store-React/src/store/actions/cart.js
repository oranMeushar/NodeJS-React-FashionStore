import * as actionsType from './actionsType';

export const addItem = (item) =>{
    return{
        type: actionsType.CART_ADD,
        payload:{
            item
        }
    }
}

export const removeItems = (items) =>{
    return{
        type: actionsType.CART_REMOVE_ITEMS,
        payload:{
            items
        }
    }
}

export const removeItem = (item) =>{
    return{
        type: actionsType.CART_REMOVE_ITEM,
        payload:{
            item
        }
    }
}

export const showCart = () =>{
    return{
        type: actionsType.CART_SHOW_CART,
    }
}

export const setCart = (cart) =>{
    return{
        type: actionsType.CART_SET_CART,
        payload:{
            cart
        }
    }
}

export const resetCart = () =>{
    return{
        type: actionsType.CART_RESET_CART
    }
}