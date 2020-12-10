import request from '../utils/request';
import qs from 'qs';


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        data: query
    });
};

export const login = form => {
    return request({
        url: '/api/login',
        data: form
    });
};
