import request from '../utils/request';

export const analyseGradeDataThroughStudent = () => {
    return request({
        url: '/api/dashboard/analyseGradeDataThroughStudent',
        method: 'get'
    });
};
