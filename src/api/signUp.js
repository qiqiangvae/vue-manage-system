import request from '../utils/request';

export const signUpList = form => {
    return request({
        url: '/api/signUp/list',
        data: form
    });
};
export const updateSignUp = form => {
    return request({
        url: '/api/signUp/update',
        data: form
    });
};

export const addSignUp = form => {
    return request({
        url: '/api/signUp/add',
        data: form
    });
};

export const deleteSignUp = form => {
    return request({
        url: '/api/signUp/delete',
        data: form
    });
};