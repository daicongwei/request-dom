import axios from 'axios';
import { Loading, Message } from 'element-ui';
let loadingInstance;
let isParms = {
    isLoading: true,//默认开启loading弹窗
    isHandleErr: true,//默认统一处理错误
};
// 创建axios实例
const instance = axios.create({
    baseURL: 'api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // 请求超时时间
})

const request = async function (options) {
    // 删除属性
    if (options?.data?.option) {
        isParms = Object.assign(isParms, options.data.option);
        delete options.data.option;
    }
    try {
        const res = await instance(options);
        const { status, message } = res.data;
        if (status === 'error') {
            // 统一处理错误
            if (isParms.isHandleErr) {
                Message({
                    showClose: true,
                    message: result.error_msg,
                    type: 'error'
                })
            }
            return Promise.reject({ msg: result.error_msg });
        } else {
            return Promise.resolve(res.data);
        }
    } catch (err) {
        return err;
    }
}


// 这里的instance为大家create的实体线
instance.interceptors.request.use(
    function (config) {
        // 开启弹窗
        if (isParms?.isLoading) {
            loadingInstance = Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.4)'
            });
        }
        return config;
    },
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
);



// 添加响应拦截器
instance.interceptors.response.use(response => {
    if (loadingInstance) {
        loadingInstance.close();
    }
    return Promise.resolve(response);
}, error => {
    if (loadingInstance) {
        loadingInstance.close();
    }
    // 对响应错误做处理
    if (error.response) {
        return Promise.reject(checkStatus(error.response));
    } else if (
        error.code == "ECONNABORTED" && error.message.indexOf("timeout") != -1
    ) {
        return Promise.reject({ msg: "请求超时" });
    } else {
        return Promise.reject({});
    }
});


function checkStatus(response) {
    console.log(response);
    const { status, result } = response;
    if (status === 'error') {
        return {
            message: result.error_msg
        }
    } else {
        return result;
    }

    return;

    if ((status >= 200 && status < 300) || status === 304) {
        return response.data;
    } else {
        let errorInfo = '';
        switch (status) {
            case -1:
                errorInfo = '远程服务响应失败,请稍后重试';
                break;
            case 400:
                errorInfo = '错误请求';
                break;
            case 401:
                errorInfo = '访问令牌无效或已过期';
                break;
            case 403:
                errorInfo = '拒绝访问';
                break;
            case 404:
                errorInfo = '资源不存在';
                break;
            case 405:
                errorInfo = '请求方法未允许'
                break;
            case 408:
                errorInfo = '请求超时'
                break;
            case 500:
                errorInfo = '访问服务失败';
                break;
            case 501:
                errorInfo = '未实现';
                break;
            case 502:
                errorInfo = '无效网关';
                break;
            case 503:
                errorInfo = '服务不可用'
                break;
            default:
                errorInfo = `连接错误`
        }
        return {
            message: response?.data?.message,
            meta: {
                status,
                msg: errorInfo,
            }
        }
    }
}


export default request