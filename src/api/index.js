import Vue from 'vue'
import request from './http';
import { apiUrl } from './apiUrl';

let services = {};
for (let key in apiUrl) {
    services[key] = (options = {}) => {
        if (apiUrl[key].method === 'POST') {
            return request(Object.assign({
                ...apiUrl[key],
            }, {
                data: {
                    ...options
                }
            }))
        }
        return request(Object.assign({
            ...apiUrl[key]
        }, {
            params: {
                ...options
            }
        }))
    }
}

Object.defineProperty(Vue.prototype, '$services', {
    value: services
});
