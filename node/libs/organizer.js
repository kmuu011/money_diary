const mysql = require('mysql');

const organizer = {};

const time_additional_list = [
    {col: 'created_at', val: 'UNIX_TIMESTAMP()', set: 'created_at = UNIX_TIMESTAMP()'},
    {col: 'created_at, updated_at', val: 'UNIX_TIMESTAMP(),UNIX_TIMESTAMP()', set: 'created_at = UNIX_TIMESTAMP(), updated_at = UNIX_TIMESTAMP()'},
    {col: 'updated_at', val: 'UNIX_TIMESTAMP()', set: 'updated_at = UNIX_TIMESTAMP()'},
];

const sql_creator = (data, key) => {
    let sql_col = '';
    let sql_val = '';
    let sql_set = '';

    sql_col += "`" + key + "`, ";

    sql_val += "?, ";
    sql_val = mysql.format(sql_val, [ data ]);

    sql_set += "`" + key + "` = ?, ";
    sql_set = mysql.format(sql_set, [ data ]);

    return { sql_col, sql_val, sql_set };
};

organizer.get_sql = (data_obj, require_keys, optional_keys, time_additional) => {
    let sql_col = '';
    let sql_val = '';
    let sql_set = '';

    if(require_keys !== undefined) {
        if(require_keys.constructor !== String) {
            require_keys = require_keys.toString();
        }

        require_keys = require_keys.replace(/\s/g, '').split(',');

        for (const k of require_keys) {
            const sql_piece = sql_creator(data_obj[k], k);

            sql_col += sql_piece.sql_col;
            sql_val += sql_piece.sql_val;
            sql_set += sql_piece.sql_set;
        }
    }

    if(optional_keys !== undefined){
        if(optional_keys.constructor !== String) {
            optional_keys = optional_keys.toString();
        }

        optional_keys = optional_keys.replace(/\s/g, '').split(',');

        for(const k of optional_keys){
            if(data_obj[k] === undefined) continue;

            const sql_piece = sql_creator(data_obj[k], k);

            sql_col += sql_piece.sql_col;
            sql_val += sql_piece.sql_val;
            sql_set += sql_piece.sql_set;
        }
    }

    if(time_additional !== undefined){
        const time_additional_obj = time_additional_list[time_additional];

        sql_col += time_additional_obj.col;
        sql_val += time_additional_obj.val;
        sql_set += time_additional_obj.set;
    }

    return { sql_col, sql_val, sql_set };
};


module.exports = organizer;
