import request from '../utils/request';


export const findStudentScore = () => {
    return request({
        url: '/api/findStudentScore',
        method: 'get'
    });
};
