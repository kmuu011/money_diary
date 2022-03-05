import config from "config/config";

const utils = {};

utils.commaParser = function(number, type, invisible){
    if(number === null || number === undefined) return 0;

    if(type === undefined){
        number = number.toLocaleString();
    }else{
        type = type === 0 ? '-' : '+';
        number = type + number.toLocaleString();
    }

    if(invisible === 1){
        number = number.toString().split('').map(v=>(v===',' ? ',' : '-'));
    }

    return number;
};

utils.disableScroll = function () {
    document.querySelector('html').style['overflow'] = 'hidden';
};

utils.enableScroll = function () {
    document.querySelector('html').style['overflow'] = 'auto';
};

utils.leftPadding = function(value, count, str) {
    return value.toString().padStart(count, str);
};

utils.getLocation = function () {
    return config.domain
};

utils.reg_or_maker = async (list) => {
    let reg = '';

    list.forEach((item, i, self) => {
        reg += "^" + item + "$";
        if(parseInt(i)+1 !== self.length) reg += "|";
    });

    return new RegExp(reg);
};

export default utils;
