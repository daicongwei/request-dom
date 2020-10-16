import Vue from 'vue'
import * as apiUrl from './apiUrl';
Object.defineProperty(Vue.prototype, '$services', {
    value: apiUrl
});
