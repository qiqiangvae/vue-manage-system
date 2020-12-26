import request from '../utils/request';


export const findStudentScore = query => {
    return request({
        url: '/api/studentExamScore',
        data: query
    });
};
