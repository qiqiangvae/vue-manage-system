import request from '../utils/request';


export const roleList = query => {
    return request({
        url: '/api/role/list',
        data: query
    });
};
export const updateRole = form => {
    return request({
        url: '/api/role/update',
        data: form
    });
};

export const addRole = form => {
    return request({
        url: '/api/role/add',
        data: form
    });
};
export const deleteRole = form => {
    return request({
        url: '/api/role/delete',
        data: form
    });
};
