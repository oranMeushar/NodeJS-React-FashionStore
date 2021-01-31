import * as actionsType from './actionsType';


export const success = (token) => {
    return{
        type:actionsType.AUTH_SUCCESS,
        payload:{
            token
        }
    }
}

export const logout = () => {
    return{
        type:actionsType.AUTH_LOGOUT
    }
}