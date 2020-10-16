import request from "./request";

export const swiperdata = params => request('get', '/home/swiperdata', params)
export const wxlogin = params => request('post', '/users/wxlogin', params) 