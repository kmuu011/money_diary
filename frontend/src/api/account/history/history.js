import Axios from 'utils/axios';

const history = {};

history.selectList = async (params) => {
    let url = `account/${params.account_idx}/history?page=${params.page}`;

    if(params.time !== null){
        url += `&year=${params.time.year}&month=${params.time.month}&date=${params.time.date}`
    }

    if(params.category !== undefined && params.category !== null){
        url += `&category_idx=${params.category}`;
    }

    if(params.time === null) {
        if (params.year !== null) {
            url += `&year=${params.year}`;
        }

        if (params.month !== undefined && params.month !== null) {
            url += `&month=${params.month}`;
        }
    }

    if(params.type !== null){
        url += `&type=${params.type}`;
    }

    return await Axios.api('GET', url);
};

history.insert = async (params) => {
    return await Axios.api('POST', `account/${params.account_idx}/history`, params);
};

history.update = async (params) => {
    return await Axios.api('PATCH',
        `account/${params.account_idx}/history/${params.history_idx}`, params);
}

history.delete = async (params) => {
    return await Axios.api('DELETE',
        `account/${params.account_idx}/history/${params.history_idx}`);
};

history.selectCategory = async (params) => {
    return await Axios.api('GET',
        `account/${params.account_idx}/history/category?type=${params.type}`)
};

history.insertCategory = async (params) => {
    return await Axios.api('POST',
        `account/${params.account_idx}/history/category`, params);
};

history.updateCategory = async (params) => {
    return await Axios.api('PATCH',
        `account/${params.account_idx}/history/category/${params.category_idx}`, params);
};

history.deleteCategory = async (params) => {
    return await Axios.api('DELETE',
        `account/${params.account_idx}/history/category/${params.category_idx}`, params);
};

history.selectDailySituation = async (params) => {
    return await Axios.api('GET',
        `account/${params.account_idx}/history/daily_situation?start=${params.start}&end=${params.end}`);
};

history.selectMonthSituation = async (params) => {
    return await Axios.api('GET',
        `account/${params.account_idx}/history/month_situation?year=${params.year}&month=${params.month}`);
};

history.selectChartSetting = async (params) => {
    let url = `account/${params.account_idx}/history/chart_setting?type=${params.type}&year=${params.year}`;

    if(params.month !== undefined){
        url += `&month=${params.month}`;
    }

    return await Axios.api('GET', url);
};

export default history;
