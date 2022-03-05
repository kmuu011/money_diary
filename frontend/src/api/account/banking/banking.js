import Axios from 'utils/axios';

const banking = {};

banking.check = async (account_idx, data) => {
    return await Axios.api('GET', 'account/' + account_idx + '/banking'+ data);
};

export default banking;
