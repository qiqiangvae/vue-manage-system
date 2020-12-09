import request from '../utils/request';
import qs from 'qs';


export const teacherList = query => {
    return request({
        url: '/api/list/teacher',
        method: 'get',
        params: query
    });
};
export const updateTeacher = form => {
    return request({
        url: '/api/teacher/' + form.id,
        method: 'put',
        data: form
    });
};

export const addTeacher = form => {
    return request({
        url: '/api/teacher/',
        method: 'post',
        data: form
    });
};
