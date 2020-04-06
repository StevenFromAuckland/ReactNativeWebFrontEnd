import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import home from './reducers/home';
import category from './reducers/category';
import product from './reducers/product';




export default (history) => combineReducers({
    home,
    category,
    product,
    router: connectRouter(history),
});
