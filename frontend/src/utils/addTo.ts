// utils.ts
// Favourits
export const itemToggleGuestFav = (newProductId: number) => {
    // Retrieve the existing data
    const storedFavs = window.sessionStorage.getItem("fav");

    // Parse the data (or initialize an empty array if it doesn't exist)
    let favs = storedFavs ? JSON.parse(storedFavs) : [];

    // Check if the product is already in the fav if exists remove it if not add it
    if (!favs.includes(newProductId)) {
        favs.push(newProductId);
    } else {
        favs = favs.filter((id: number) => id !== newProductId);
    }

    const updatedFavsString = JSON.stringify(favs);
    window.sessionStorage.setItem("fav", updatedFavsString);
}

export const getGuestFavs = (): number[] => {
    if (typeof window === "undefined") return [];
    const storedFavs = window.sessionStorage.getItem("fav");
    return storedFavs ? JSON.parse(storedFavs) : [];
};

export const clearGuestFavs = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem("fav");
}

export const getUserFavs = (userName: string): number[] => {
    if (typeof window === "undefined") return [];
    const userFavKey = userName + "favs";
    const _userFavs = window.sessionStorage.getItem(userFavKey);
    return _userFavs ? JSON.parse(_userFavs) : [];
}

export const itemToggleUserFav = (newProductId: number, userName: string) => {
    const userFavKey = userName + "favs";
    let favs = getUserFavs(userName);
    
    // Check if the product is already in the fav if exists remove it if not add it
    if (!favs.includes(newProductId)) {
        favs.push(newProductId);
    } else {
        favs = favs.filter((id: number) => id !== newProductId);
    }

    const updatedFavsString = JSON.stringify(favs);
    window.sessionStorage.setItem(userFavKey, updatedFavsString);
}

export const transferFavs = (userName: string) => {
    const userFavKey = userName + "favs";
    // first get the existing products that in favs if exists.
    const guestFavs = window.sessionStorage.getItem("fav");
    // set it to userFavs
    if (guestFavs) {
        window.sessionStorage.setItem(userFavKey, guestFavs);
    }
    // remove the guest favs
    clearGuestFavs();
}

export const mergeUserFavsWithGuestFavs = (userName: string) => {
    const userFavKey = userName + "favs";
    const userFavs = getUserFavs(userFavKey);
    const guestFavs = getGuestFavs();

    const userFavsSet = new Set(userFavs);
    guestFavs.forEach(id => userFavsSet.add(id));
    const mergedFavs = Array.from(userFavsSet);

    window.sessionStorage.setItem(userFavKey, JSON.stringify(mergedFavs));

    clearGuestFavs();
}

// Cart
export const getGuestCart = (): number[] => {
    if (typeof window === "undefined") return [];
    const storedinCart = window.sessionStorage.getItem("cart");
    return storedinCart ? JSON.parse(storedinCart) : []; 
};

export const itemToggleGuestCart = (newProductId: number) =>{
    // Retrieve the existing data
    let cart = getGuestCart();

    // Check if the product is already in the cart if exists remove it if not add it
    if (!cart.includes(newProductId)) {
        cart.push(newProductId);
    }else{
        cart = cart.filter((id: number) => id !== newProductId);
    }

    const updatedinCartString = JSON.stringify(cart);
    window.sessionStorage.setItem("cart", updatedinCartString);
}

export const clearGuestCart = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem("cart");
}

export const getUserCart = (userName: string) : number[] => {
    if (typeof window === "undefined") return [];
    const _userCart = window.sessionStorage.getItem(userName);
    return _userCart ? JSON.parse(_userCart) : [];
}

export const itemToggleUserCart = (newProductId: number, userName: string) =>{
    // Retrieve the existing data
    let cart = getUserCart(userName);

    // Check if the product is already in the cart if exists remove it if not add it
    if (!cart.includes(newProductId)) {
        cart.push(newProductId);
    }else{
        cart = cart.filter((id: number) => id !== newProductId);
    }

    const updatedinCartString = JSON.stringify(cart);
    window.sessionStorage.setItem(userName, updatedinCartString);
}

// if a user is registered transfer the cart content to him here
export const transferCart = (userName : string) => {
    // first get the existing products that in cart if exists.
    const guestCart = window.sessionStorage.getItem("cart");
    // set it to userCart
    if(guestCart){
        window.sessionStorage.setItem(userName, guestCart);
    }
    // remove the guest cart
    window.sessionStorage.removeItem("cart");
}

export const mergeUserCartWithGuestCart = (userName: string) => {
    const userCart = getUserCart(userName);
    const guestCart = getGuestCart();

    const userCartSet = new Set(userCart);
    guestCart.forEach(id => userCartSet.add(id));
    const mergedCart = Array.from(userCartSet);

    window.sessionStorage.setItem(userName, JSON.stringify(mergedCart));
    
    clearGuestCart();
}