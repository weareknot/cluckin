const database = require('./database');

const noneCallback = () => {
};

function ensureDb() {
    database.query('create extension if not exists fuzzystrmatch', noneCallback);
    let sql = `create table if not exists 
                triggers(
                    name text,
                    description text, 
                    requests integer,
                    blacklist bool,
                    adult bool,
                    channels text,
                    exceptions text,
                    constraint triggers_pk primary key (name));`;
    database.query(sql, noneCallback);
}

function addTrigger(name, description, blacklist, adult, channels, exceptions) {
    ensureDb();
    name = name.replace(/'/g, "''");
    description = description.replace(/'/g, "''");
    blacklist = blacklist | false;
    adult = adult | false;
    channels = channels === null || channels === undefined ? 'null' : `'${channels}'`;
    exceptions =
        exceptions === null || exceptions === undefined ? 'null' : `'${exceptions}'`;
    let values = `'${name}', '${description}', 1, ${blacklist ? 'true' :
                                                    'false'}, ${adult ? 'true' :
                                                                'false'}, ${channels}, ${exceptions}`;
    let setDesc = description !== '' ?
                  `, description = '${description}'` :
                  '';
    let sql = `insert into triggers
               values(${values})
               on conflict (name) do 
                update set requests = triggers.requests + 1${setDesc};`;
    database.query(sql, noneCallback);
}


function removeTrigger(names) {
    ensureDb();
    let where = `name in ('${names.join("','")}')`;
    let sql = `delete from triggers
               where ${where}`;
    database.query(sql, noneCallback);
}


function selectTriggers(keywords, limit, cb) {
    ensureDb();
    keywords = keywords.replace(/'/g, "''");
    let orderBy = keywords === '' ? 'name asc' :
                  `levenshtein(triggers.name, '${keywords}') asc`;
    let sql = `select name, description, blacklist, adult, channels, exceptions from triggers
               where 
                    name like '%${keywords}%' or
                    description like '%${keywords}%' or 
                    levenshtein(triggers.name, '${keywords}') < ${limit} or
                    levenshtein(triggers.description, '${keywords}') < ${limit}
               order by ${orderBy}`;
    database.query(sql, (res) => {
        cb(res.rows)
    });
}


module.exports = {
    add: addTrigger,
    remove: removeTrigger,
    select: selectTriggers
};