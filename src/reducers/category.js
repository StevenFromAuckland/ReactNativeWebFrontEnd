import {
    CATEGORY_PAGE_LOADED,
    CATEGORY_PAGE_UNLOADED,
    ADD_CATEGORY,
    DELETE_CATEGORY,
    ADD_CATEGORY_UNLOADED,
    ASYNC_START,
    EDIT_CATEGORY_LOADED,
    EDIT_CATEGORY_UNLOADED

} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case CATEGORY_PAGE_LOADED:
            return {
                ...state,
                categories: action.payload,
            };
        case CATEGORY_PAGE_UNLOADED:
            return {};
        case ADD_CATEGORY:
            return {
                ...state,
                inProgress: false,
                categories: action.error ?
                    null :
                    (state.categories || []).concat([action.payload])
            };
        case ADD_CATEGORY_UNLOADED:
            return { categories: state.categories};
        case DELETE_CATEGORY:
            const categoryId = action.categoryId
            return {
                ...state,
                categories: state.categories.filter(c => c.categoryId !== categoryId)
            };
        case ASYNC_START:
            if (action.subtype === ADD_CATEGORY) {
                return { ...state, inProgress: true };
            }
            break;
        case EDIT_CATEGORY_LOADED:
            return {
                ...state,
                category: action.payload,
            };
        case EDIT_CATEGORY_UNLOADED:
            return {
                ...state,
                category: null,
            };
        case DELETE_CATEGORY:
            return {
                ...state,
                categories: state.categories.filter(c => c.categoryId !== action.categoryId)
            };
    }
    return state;
};
