import {
    PRODUCT_PAGE_LOADED,
    PRODUCT_PAGE_UNLOADED,
    ADD_PRODUCT,
    DELETE_PRODUCT,
    ADD_PRODUCT_UNLOADED,
    ASYNC_START,
    EDIT_PRODUCT_LOADED,
    EDIT_PRODUCT_UNLOADED

} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_PAGE_LOADED:
            return {
                ...state,
                products: action.payload,
            };
        case PRODUCT_PAGE_UNLOADED:
            return {};
        case ADD_PRODUCT:
            return {
                ...state,
                inProgress: false,
                products: action.error ?
                    null :
                    (state.products || []).concat([action.payload])
            };
        case ADD_PRODUCT_UNLOADED:
            return { products: state.products };
        case DELETE_PRODUCT:
            const productId = action.productId
            return {
                ...state,
                products: state.products.filter(c => c.productId !== productId)
            };
        case ASYNC_START:
            if (action.subtype === ADD_PRODUCT) {
                return { ...state, inProgress: true };
            }
            break;
        case EDIT_PRODUCT_LOADED:
            return {
                ...state,
                product: action.payload,
            };
        case EDIT_PRODUCT_UNLOADED:
            return {
                ...state,
                product: null,
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(c => c.productId !== action.productId)
            };
    }
    return state;
};
