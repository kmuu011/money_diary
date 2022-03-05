import Axios from 'utils/axios';

const account = {};

account.selectOne = async (params) => {
    return await Axios.api('GET',`account/${params.account_idx}`);
};

account.selectList = async () => {
    return await Axios.api('GET', 'account');
};

account.insert = async (params) => {
    return await Axios.api('POST', 'account', params);
};

account.update = async (params) => {
    return await Axios.api('patch', `account/${params.account_idx}`, params);
};

account.delete = async (params) => {
    return await Axios.api('DELETE', 'account/' + params.account_idx);
};


export default account;
