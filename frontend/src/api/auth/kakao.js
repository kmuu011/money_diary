import Axios from 'utils/axios';

const kakao = {};

kakao.sign_check = async (data) => {
    return await Axios.api('GET', 'auth/kakao/get_member_data'+ data);
};

kakao.sign_up = async (data) => {
    return await Axios.api('POST', 'auth/kakao/sign_up', data);
};

kakao.member_link = async (data) => {
    return await Axios.api('POST', 'auth/kakao/member_link', data);
};


export default kakao;
