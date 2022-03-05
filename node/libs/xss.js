const xss = {};

const start_script = '<script>';
const end_script = '</script>';

const script_tag_remover = async (data, is_string, script) => {
    if(is_string){
        while(data.toString().toLowerCase().indexOf(script) !== -1){
            const start_idx = data.toString().toLowerCase().indexOf(script);
            const end_idx = start_idx + script.length;
            data = data.substring(0, start_idx) + data.substring(end_idx, JSON.stringify(data).length);
        }
    }else{
        while(JSON.stringify(data).toLowerCase().indexOf(script) !== -1){
            const start_idx = JSON.stringify(data).toLowerCase().indexOf(script);
            const end_idx = start_idx + script.length;
            data = JSON.parse(JSON.stringify(data).substring(0, start_idx) + JSON.stringify(data).substring(end_idx, JSON.stringify(data).length));
        }
    }

    return data;
};

xss.check = async (data) => {
    if(data === undefined) return;

    for (const k in data) {
        if(!data.hasOwnProperty(k)) continue;

        if(data[k] === undefined || data[k].constructor === Number || data[k].constructor === Boolean){
            continue;
        }

        let is_string = !(data[k].constructor === Array || data[k].constructor === Object);

        data[k] = await script_tag_remover(data[k], is_string, start_script);
        data[k] = await script_tag_remover(data[k], is_string, end_script);
    }

    return data;
};

module.exports = xss;
