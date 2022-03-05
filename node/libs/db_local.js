const pool_obj = require('./db_pool');
const pool = pool_obj.local;
const db = {};

db.get_connection = async () => {
    let connector;

    try {
        connector = await new Promise(async (resolve, reject) => {
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

    return connector;
};

db.run = async (connector, sql) => {
    let result;

    try {
        result = await new Promise(async (resolve, reject) => {
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

    return result;
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
    connector.rollback(function(){});
    connector.release();
};


db.release = async (connector) => {
    connector.release();
};


async function query (sql, connect) {
    let run;

    try {
        run = await new Promise(async (resolve, reject) => {
            connect.getConnection(function (err, connection) {
                if (err) {
                    console.log('-------DB CONNECTION ERROR-------');
                    throw err;
                }

                try {
                    connection.query(sql, function (err, rows) {
                        if (err) {
                            return reject(err)
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

    return run;
}

db.query = async (sql) => {
    return await query(sql, pool);
};


module.exports = db;
