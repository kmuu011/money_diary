import Axios from 'utils/axios';

const sign = {};

sign.select_member = async () => {
    return await Axios.api('GET', 'member');
};

sign.update_member = async (params) => {
    return await Axios.api('PATCH', 'member', params);
};

sign.update_profile_img = async (params) => {
    return await Axios.api('PATCH', 'member/img', params);
};

sign.login = async (params) => {
    return await Axios.api('POST', 'member/login', params);
};

sign.sign_up = async (params) => {
    return await Axios.api('POST', 'member/sign_up', params);
};

sign.id_check = async (params) => {
    return await Axios.api('POST', 'member/id_check', params);
};

sign.nick_check = async (params) => {
    return await Axios.api('POST', 'member/nick_check', params);
};

sign.email_check = async (params) => {
    return await Axios.api('POST', 'member/email_check', params);
};


export default sign;
