module.exports = {
    getUserNameHandler: userNameHandler,

    getConfirmationDataHandler: confirmationDataHandler,

    getCreditsArrayHandler: creditsArrayHandler,
}

//------------------------------------------------------------------------
//                 ЗАПРОС НА ПОЛУЧЕНИЕ ИМЕНИ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

function getPhysUserNameQuery(user) {
    var sql = `SELECT first_name FROM clients
                WHERE
                client_id = ${user.userid};`;
    return sql;
}

function getJurUserNameQuery(user) {
    var sql = `SELECT orgname FROM clients
                WHERE
                client_id = ${user.userid};`;
    return sql;
}

function getUserNameQuery(user) {
    var type = user.client_type;
    if (type == "phys") {
        return getPhysUserNameQuery(user);
    }
    else if (type == "jur") {
        return getJurUserNameQuery(user);
    }
}

function userNameHandler(pool, user, response) {
    var sql = getUserNameQuery(user);
    pool.query(sql)
        .then(data => {
            // Получаем результат запроса
            // data[0][0] – искомый объект из результата запроса select
            // С помощью Object.values получаем первый и единственный атрибут этого объекта
            var name = Object.values(data[0][0])[0];
            response.send(name);
            return;
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        });
}

//------------------------------------------------------------------------
//   ЗАПРОС НА ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ДЛЯ ПОДТВЕРЖДЕНИЯ КРЕДИТА
//------------------------------------------------------------------------

function getPhysConfirmationDataQuery(user) {
    var sql = `SELECT
                last_name,
                first_name,
                patronymic,
                passport_serial,
                passport_num,
                phone_num
            FROM clients
            WHERE
                client_id = ${user.userid};`;
    return sql;
}

function getJurConfirmationDataQuery(user) {
    var sql = `SELECT
                inn,
                orgname,
                phone_num
            FROM clients
            WHERE
                client_id = ${user.userid};`;
    return sql;
}

function getConfirmationDataQuery(user) {
    var type = user.client_type;
    if (type == "phys") {
        return getPhysConfirmationDataQuery(user);
    }
    else if (type == "jur") {
        return getJurConfirmationDataQuery(user);
    }
}

function confirmationDataHandler(pool, user, response) {
    var sql = getConfirmationDataQuery(user);
    pool.query(sql)
        .then(data => {
            // Отправялем json объект с данными из таблицы
            response.send(data[0][0]);
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        });
}


//------------------------------------------------------------------------
//           ЗАПРОС НА ПОЛУЧЕНИЕ МАССИВА КРЕДИТОВ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

function getCreditsArrayQuery(userid) {
    var sql = `SELECT * FROM credits
                WHERE
                client_id = ${userid};`;

    return sql;
}

function creditsArrayHandler(pool, userid, response) {
    var sql = getCreditsArrayQuery(userid);
    pool.query(sql)
        .then(data => {
            response.send(data[0]);
            return;
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        });
}