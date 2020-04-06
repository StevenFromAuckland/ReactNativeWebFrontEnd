import {
    UPDATE_REDIRECT_TO,
    ADD_CATEGORY,
    EDIT_CATEGORY,
    ADD_PRODUCT,
    EDIT_PRODUCT,
} from '../constants/actionTypes';

export default (state = { renderComponent: ''}, action) => {
    switch (action.type) {
        case UPDATE_REDIRECT_TO:
            return {
                renderComponent: action.renderComponent,
                entityId: action.entityId
            };
        case ADD_CATEGORY:
        case EDIT_CATEGORY:
            return {
                ...state,
                renderComponent: !action.error ? 'CategoriesList' : state.renderComponent,
                entityId: 0
            };
        case ADD_PRODUCT:
        case EDIT_PRODUCT:
            return {
                ...state,
                renderComponent: !action.error ? 'ProductsList' : state.renderComponent,
                entityId: 0
            };
    }
    return state;
};
