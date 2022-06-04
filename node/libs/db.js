const pool_obj = require('./db_pool');
const pool = pool_obj.user;
const pool_admin = pool_obj.admin;
const db = {};

db.get_connection = async () => {
    try {
        return await new Promise(async (resolve, reject) => {
            pool.getConnection(function (err, connection) {
                connection.beginTransaction(function(err) {
                    if(err){
                        console.log('transaction err');
                        console.log(err);
                        reject('Error');
                    }
                    resolve(connection);
                })
            });
        });
    }catch (e) {
        throw 'Error';
    }
};

db.run = async (connector, sql) => {
    try {
        return await new Promise(async (resolve, reject) => {
            connector.query(sql, function (err, rows) {
                if (err) {
                    console.log('----- SQL ERROR -----');
                    console.log(err);
                    reject('Error');
                }

                resolve(rows);
            });
        });

    }catch (e) {
        throw 'Error';
    }
};


db.commit = async (connector) => {
    try {
        await new Promise(async (resolve, reject) => {
            connector.commit(function (err) {
                if (err) {
                    reject(err);
                }

                connector.release();

                resolve(true);
            });
        })
    }catch (e) {
        throw 'Error';
    }
};

db.rollback = async (connector) => {
    console.log('롤백 작동');
    try {
        connector.rollback(function(){});
    }catch (e) {} finally {
        connector.release();
    }
};


db.release = async (connector) => {
    connector.release();
};

async function query (sql, connect) {
    try {
        return await new Promise(async (resolve, reject) => {
            connect.getConnection(function (err, connection) {
                if (err) {
                    console.log('-------DB CONNECTION ERROR-------');
                    throw err;
                }

                try {
                    connection.query(sql, function (err, rows) {
                        if (err) {
                            console.log('----- SQL ERROR -----');
                            console.log(err);
                            return reject('Error');
                        }

                        if(!err && rows !== undefined && rows.constructor === Array) {
                            for (const r of rows) {
                                for (const k in r) {
                                    if (r[k] === undefined || r[k] === 'undefined' || r[k] === null || r[k] === 'null' || r[k].constructor !== String) continue;

                                    r[k] = r[k].replace(/\？/g, '?');
                                }
                            }
                        }

                        return resolve(rows);
                    })
                } catch (e) {
                    console.log(e)

                } finally {
                    connection.release();
                }

            });
        });
    }catch (e) {
        console.log(e);
        throw 'Error';
    }
}

db.query = async (sql) => {
    return await query(sql, pool);
};

db.admin = async (sql) => {
    return await query(sql, pool_admin);
};


module.exports = db;
