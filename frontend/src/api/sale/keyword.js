import Axios from 'utils/axios';

const sale_keyword = {};

sale_keyword.select = async () => {
    return await Axios.api('GET', 'member/sale/keyword');
};

sale_keyword.insert = async (data) => {
    return await Axios.api('POST', 'member/sale/keyword', data);
};

sale_keyword.delete = async (data) => {
    return await Axios.api('DELETE', 'member/sale/keyword/'+data.keyword_idx);
};

sale_keyword.sendTestMail = async () => {
    return await Axios.api('POST', 'member/sale/mailing_test');
};

sale_keyword.test = async () => {
    return await Axios.api('POST', '/test/tps_test');
    // return await Axios.test('POST', '/test/tps_test');
};

export default sale_keyword;
