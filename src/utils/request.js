import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 60000
});

service.interceptors.request.use(
    config => {
        config.headers.common = {
            'Content-Type': "application/x-www-form-urlencoded",
            'QING-CHA-TOKEN': localStorage.getItem('ms_token'),
            'QING-CHA-OPERATOR': localStorage.getItem('ms_username')
        }
        if (!config.method) {
            config.method = 'post'
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject(response.data);
        }
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

const api = request => {
    return service({
        url: request.url,
        data: request.data,
        method: request.method ? request.method : 'post'
    });
};

export default api;
