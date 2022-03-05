import Axios from 'utils/axios';

const test = {};

test.test = async (params) => {
    return await Axios.api('POST', 'test', params);
};

export default test;
