import commonAPI from "./commonAPI";
import { baseURL } from "./baseURL";


export const saveToken = (token) => sessionStorage.setItem("Token", token);
export const getToken = () => sessionStorage.getItem("Token");
export const removeToken = () => sessionStorage.removeItem("Token");
export const isLoggedIn = () => !!sessionStorage.getItem("Token");

export const getAuthHeader = () => {
  const token = sessionStorage.getItem("Token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getUserList = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/user-list`, reqBody, {});
};


export const RegSendOTP = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/send-signup-otp`, reqBody, {});
};


export const RegVerifyOTP = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/verify-signup-otp`, reqBody, {});
};

export const Register = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/register`, reqBody, {});
};


export const loginPass = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/login-password`, reqBody, {});
};

export const loginSendOTP = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/generate-otp`, reqBody, {});
};


export const loginOTP = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/login-otp`, reqBody, {});
};


export const googleLoginAPI = async (token) => {
  return await commonAPI("POST", `${baseURL}/api/google-login`, { token }, {});
};

// product

export const newArrivalData = async () => {
  return await commonAPI("GET", `${baseURL}/api/new4arrivals`, null, {});
};

export const productAPI = async (id) => {
  return await commonAPI("GET", `${baseURL}/api/product/${id}`, null, {});
};
export const allProductAPI = async (id) => {
  return await commonAPI("GET", `${baseURL}/api/all-product`, null, {});
};
export const bestSellerAPI = async (id) => {
  return await commonAPI("GET", `${baseURL}/api/bestSeller`, null, {});
};

export const searchProductAPI = async (query) => {
  return await commonAPI("GET", `${baseURL}/api/search?query=${query}`, null, {});
};
//wishlist

export const addToWishlistAPI = async (id) => {
  return await commonAPI("POST", `${baseURL}/api/wishlist/add/${id}`, {}, getAuthHeader());
};

export const removeFromWishlistAPI = async (id) => {
  return await commonAPI("DELETE", `${baseURL}/api/wishlist/remove/${id}`, null, getAuthHeader());
};

export const getWishlistDataAPI = async () => {
  return await commonAPI("GET", `${baseURL}/api/wishlist`, {}, getAuthHeader());
};

//cart

export const addCartAPI = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/cart/add`, reqBody, getAuthHeader());
};

export const decreaseCartAPI = async (reqBody) => {
  return await commonAPI("DELETE", `${baseURL}/api/cart/decrease`, reqBody, getAuthHeader());
};

export const removeItemCartAPI = async (reqBody) => {
  return await commonAPI("DELETE", `${baseURL}/api/cart/removeItem`, reqBody, getAuthHeader());
};

export const clearCartAPI = async () => {
  return await commonAPI("DELETE", `${baseURL}/api/cart/remove`, {}, getAuthHeader());
};

export const getCartDataAPI = async () => {
  return await commonAPI("GET", `${baseURL}/api/cart`, {}, getAuthHeader());
};


// address

export const createAddressAPI = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/address/create`, reqBody, getAuthHeader());
};
export const UpdateAddressAPI = async (id, reqBody) => {
  return await commonAPI("PUT", `${baseURL}/api/address/update/${id}`, reqBody, getAuthHeader());
};
export const deleteAddressAPI = async (id, reqBody) => {
  return await commonAPI("DELETE", `${baseURL}/api/address/delete/${id}`, reqBody, getAuthHeader());
};
export const AddressAPI = async () => {
  return await commonAPI("GET", `${baseURL}/api/address`, {}, getAuthHeader());
};

//order

export const createPaymentAPI = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/order/create`, reqBody, getAuthHeader());
};
export const confirmPaymentAPI = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/order/confirm`, reqBody, getAuthHeader());
};
export const FailPaymentAPI = async (reqBody) => {
  return await commonAPI("POST", `${baseURL}/api/order/fail`, reqBody, getAuthHeader());
};
export const allOrdersAPI = async () => {
  return await commonAPI("GET", `${baseURL}/api/orders`, {}, getAuthHeader());
};