const database = require('./database');

const noneCallback = () => {};

function ensureDb() {
    let sql = `create table if not exists 
                birthdays(
                    userid text, 
                    name text,
                    day integer, 
                    month integer,
                    constraint pk primary key (userid, name));`;
    database.query(sql, noneCallback);
}

function addBirthday(user, name, day, month) {
    ensureDb();
    let values = `${user.id}, '${name.replace(/'/g, "''")}', ${day}, ${month}`;
    let sql = `insert into birthdays(userid, name, day, month)
               values(${values})
               on conflict (userid, name) do 
                update set (userid, name, day, month) = (${values});`;
    database.query(sql, noneCallback);
}


function removeBirthday(user, names) {
    ensureDb();
    let where = names === undefined ?
                `userid = '${user.id}'` :
                `userid = '${user.id}' and name in ('${names.map(
                    (n) => n.replace(/'/g, "''")).join("','")}')`;
    let sql = `delete from birthdays
               where ${where}`;
    database.query(sql, noneCallback);
}


function todaysBirthdays(cb) {
    ensureDb();
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let sql = `select userid, name from birthdays where day = ${day} and month = ${month}`;
    database.query(sql, (res) => {
        res.rows.forEach((r) => {
            cb(r);
        });
    });
}

function ourBirthdays(user, cb) {
    ensureDb();
    let sql = `select day, month, string_agg(name, ', ') as names
               from birthdays where userid = '${user.id}'
               group by day, month
               order by names, month, day;`;
    database.query(sql, (res) => cb(res.rows));
}

function registeredUsers(user, cb) {
    ensureDb();
    let sql;
    if (user === undefined) {
        sql = `select userid, string_agg(name, ', ') as names
               from birthdays
               group by userid;`;
    } else {
        sql = `select userid, string_agg(name, ', ') as names
               from birthdays where userid = '${user.id}'
               group by userid;`;
    }
    database.query(sql, (res) => cb(res.rows));
}

module.exports = {
    add: addBirthday,
    remove: removeBirthday,
    today: todaysBirthdays,
    ours: ourBirthdays,
    users: registeredUsers
};