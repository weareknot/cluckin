const {Pool, Client} = require('pg');

const pool = new Pool();

function query(sql, cb) {
    // https://node-postgres.com/features/pooling
    pool.connect()
        .then((client) => {
            return client.query(sql)
                         .then((res) => {
                             cb(res);
                         })
                         .catch((e) => {
                             console.log(e);
                         })
                         .finally(() => {
                             client.release();
                         })
        })
        .catch((e) => {
            console.log(e);
        });
}

module.exports = {
    query: query,
    pool: pool
};
