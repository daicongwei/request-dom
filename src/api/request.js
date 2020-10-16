import axios from 'axios';
import { Loading, Message } from 'element-ui';

let loadingInstance; //loading 实例
let isLoading = true;//默认开启loading弹窗
let isHandleErr = true;//默认统一处理错误

// 创建axios实例
const instance = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
    // 开启弹窗
    if (isLoading) {
        loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.4)'
        });
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
    closeLoading()
    return Promise.resolve(response);
}, error => {
    closeLoading()
    // 对响应错误做处理
    if (error.response) {
        return Promise.reject(error.response);
    } else if (
        error.code == "ECONNABORTED" && error.message.indexOf("timeout") != -1
    ) {
        return Promise.reject({ data: { status: -2, message: "请求超时" } });
    } else {
        return Promise.reject({ data: { status: -1 } });
    }
});

// 关闭loading
function closeLoading() {
    loadingInstance && loadingInstance.close();
}

// 请求方法
function request(method, url, params) {
    if (params.hasOwnProperty('isLoading')) {
        isLoading = params.isLoading
        delete params.isLoading
    }
    if (params.hasOwnProperty('isHandleErr')) {
        isHandleErr = params.isHandleErr
        delete params.isHandleErr
    }
    switch (method) {
        case 'post':
            params = {
                method,
                data: params
            }
            break;
        default:
            params = { method, params }
            break;
    }
    return new Promise((resolve, reject) => {
        instance.request(url, params)
            .then(res => {
                let { status, result } = res?.data;
                if (status === "success") {
                    resolve(result)
                } else {
                    handleError(result)
                }
            })
            .catch(err => {
                let { status, message } = err?.data;
                let result = checkStatus(status, message);
                handleError(result)
            })
    })
}

// 统一处理错误
function handleError(result) {
    if (isHandleErr) {
        Message && Message.closeAll();
        Message({
            showClose: true,
            message: result.error_msg || result.resMessage,
            type: 'error'
        })
    } else {
        return Promise.reject(result)
    }
}

// 错误状态判断
function checkStatus(status, resMessage) {
    let error_msg = '';
    switch (status) {
        case -2:
            error_msg = resMessage;
            break;
        case -1:
            error_msg = '远程服务响应失败,请稍后重试';
            break;
        case 400:
            error_msg = '错误请求';
            break;
        case 401:
            error_msg = '访问令牌无效或已过期';
            break;
        case 403:
            error_msg = '拒绝访问';
            break;
        case 404:
            error_msg = '资源不存在';
            break;
        case 405:
            error_msg = '请求方法未允许'
            break;
        case 408:
            error_msg = '请求超时'
            break;
        case 500:
            error_msg = '访问服务失败';
            break;
        case 501:
            error_msg = '未实现';
            break;
        case 502:
            error_msg = '无效网关';
            break;
        case 503:
            error_msg = '服务不可用'
            break;
        default:
            error_msg = `连接错误`
    }
    return {
        error_msg,
        status,
        resMessage
    }

}

export default request