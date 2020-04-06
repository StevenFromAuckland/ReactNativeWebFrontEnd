import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8080/api';

const responseBody = res => res.body;


const requests = {
    del: url =>
        superagent.del(`${API_ROOT}${url}`).then(responseBody),
    get: url =>
        superagent.get(`${API_ROOT}${url}`).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};


const Categories = {
    getAll: () =>
        requests.get('/categories'),
    getById: categoryId =>
        requests.get(`/categories/${categoryId}`),
    create: category =>
        requests.post('/categories', category),
    update: category =>
        requests.put('/categories', category),
    delete: categoryId =>
        requests.del(`/categories/${categoryId}`),
};


const Products = {
    getAll: () =>
        requests.get('/products'),
    getById: productId =>
        requests.get(`/products/${productId}`),
    create: product =>
        requests.post('/products', product),
    update: product =>
        requests.put('/products', product),
    delete: productId =>
        requests.del(`/products/${productId}`),
};


export default {
    Categories,
    Products,
};
