
export const setLocalWithExpire = () =>{
    const now = Date.now();
    const item = {
        userCart:{
            cart:[],
            totalItems:0,
            totalPrice:0,
        },
        expire:now +  2 * 60 * 60 * 1000 //*2 hours
    };
    
    localStorage.setItem('cart', JSON.stringify(item));
}

export const getLocalWithExpire = () =>{
    let item = localStorage.getItem('cart');
    const now = Date.now();

    if (!item) {
        return null;
    }
    item = JSON.parse(item);
    if (now > item.expire) { //*two hours passed
        localStorage.removeItem('cart');
        return null;
    }
    return item.userCart;
}