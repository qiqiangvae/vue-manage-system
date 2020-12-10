import request from '../utils/request';


export const studentList = query => {
    return request({
        url: '/api/student/list',
        data: query
    });
};
export const updateStudent = form => {
    return request({
        url: '/api/student/update',
        data: form
    });
};

export const addStudent = form => {
    return request({
        url: '/api/student/add',
        data: form
    });
};
export const deleteStudent = form => {
    return request({
        url: '/api/student/delete',
        data: form
    });
};
