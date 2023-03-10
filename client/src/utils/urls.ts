const default_url = 'localhost'
const PORT = 8001;
const DEFAULT_PATH =  `http://${default_url}:${PORT}/`

export const LOGIN_URL = DEFAULT_PATH + 'login';
export const REGISTER_URL = DEFAULT_PATH + 'register';
export const SET_PRODUCT_URL = DEFAULT_PATH + 'set-product'
export const GET_PRODUCTS_URL = DEFAULT_PATH + 'get-products'
export const GET_MY_PRODUCTS_URL = DEFAULT_PATH + 'get-my-products'
export const DELETE_PRODUCTS_URL = DEFAULT_PATH + 'delete-products'
export const CHANGE_PRODUCT_URL = DEFAULT_PATH + 'change-product'
export const UPLOAD_PHOTOS_URL = DEFAULT_PATH + 'upload-images'
export const GET_IMAGES_URL = DEFAULT_PATH + 'get-images'
export const GET_RANDOM_PRODUCTS_URL = DEFAULT_PATH + 'get-random-products'
export const GET_PRODUCTS_BY_NAME_URL = DEFAULT_PATH + 'get-products-by-name'