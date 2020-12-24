import request from '../utils/request';
import qs from 'qs';


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        data: query
    });
};

export const findPublicSystemConfig = form => {
    return request({
        url: '/api/systemConfig/findPublic',
        data: form
    });
};

export const login = form => {
    return request({
        url: '/api/edu/login',
        data: form
    });
};
export const authCode = () => {
    return request({
        url: '/api/edu/login/authCode',
    });
};

export const logout = form => {
    return request({
        url: '/api/edu/logout',
        data: form
    });
};
