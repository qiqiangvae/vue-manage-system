import request from '../utils/request';

export const courseList = form => {
    return request({
        url: '/api/course/list',
        data: form
    });
};
export const updateCourse = form => {
    return request({
        url: '/api/course/update',
        data: form
    });
};

export const addCourse = form => {
    return request({
        url: '/api/course/add',
        data: form
    });
};

export const deleteCourse = form => {
    return request({
        url: '/api/course/delete',
        data: form
    });
};