import request from '../utils/request';


export const getAuthorityTree = data => {
    return request({
        url: '/api/authority/authorityTree',
        data: data
    });
};

export const addAuthority = data => {
    return request({
        url: '/api/authority/addAuthority',
        data: data
    });
};

export const deleteAuthority = data => {
    return request({
        url: '/api/authority/deleteAuthority',
        data: data
    });
};
