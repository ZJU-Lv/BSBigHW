import axios from 'axios'


let token = localStorage.getItem('Authorization');
let header = { 'Authorization': 'Bearer ' + token };

//所有在你的 this的vue实例 用_Vue代替就完事了
axios.defaults.timeout = 500000;//响应时间
// axios.defaults.crossDomain = true;
// axios.defaults.withCredentials = true;  //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
axios.defaults.baseURL = window.ApiUrl;   //配置接口地址
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post' && config.url != "/serviceAccount/uploadImg" && config.url != "/material/image/upload" && config.url != "/material/video/upload" && config.url != "/material/sound/upload" && config.url != "/serviceAccount/deleteAccounts") {
        config.data = JSON.stringify(config.data);
    }
    else if (config.method === 'get') {
        config.url = config.url + '?timestamp=' + new Date().getTime();
    }
    return config;
}, (error) => {
    //console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事
    if (!res.data.success) {
        return Promise.resolve(res.data);
    }
    return res.data;
}, (error) => {
    //console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    // console.log('调用接口时需要在header中设置的token值:',token);
    return new Promise((resolve, reject) => {
        // axios.post(url, params)
        axios.post(url, params, { headers: header }) //添加header
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    // console.log('调用接口时需要在header中设置的token值:',token);
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: param,
            headers: header
        })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//返回一个Promise(发送put请求)
export function fetchPut(url, params) {
    // console.log('调用接口时需要在header中设置的token值:',token);
    return new Promise((resolve, reject) => {
        // axios.put(url, params)
        axios.put(url, params, { headers: header }) //添加header
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

////返回一个Promise(发送delete请求)
export function fetchDelete(url, params) {
    // console.log('调用接口时需要在header中设置的token值:',token);
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            data: params,
            headers: header
        })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchDelete,
}
