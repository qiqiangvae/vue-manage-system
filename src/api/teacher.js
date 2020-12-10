import request from '../utils/request';


export const teacherList = query => {
    return request({
        url: '/api/teacher/list',
        data: query
    });
};
export const updateTeacher = form => {
    return request({
        url: '/api/teacher/update',
        data: form
    });
};

export const addTeacher = form => {
    return request({
        url: '/api/teacher/add',
        data: form
    });
};
export const deleteTeacher = form => {
    return request({
        url: '/api/teacher/delete',
        data: form
    });
};
