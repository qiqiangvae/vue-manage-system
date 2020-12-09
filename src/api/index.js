import request from '../utils/request';
import qs from 'qs';


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const courseList = query => {
    return request({
        url: '/api/list/course',
        method: 'get',
        params: query
    });
};
export const updateCourse = form => {
    return request({
        url: '/api/course/' + form.id,
        method: 'put',
        data: form
    });
};

export const addCourse = form => {
    return request({
        url: '/api/course/',
        method: 'post',
        data: form
    });
};

export const login = form => {
    return request({
        url: '/api/login',
        method: 'post',
        data: form
    });
};
