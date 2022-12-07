module.exports = {
    loginHandler: loginHandler
}

//------------------------------------------------------------------------
//              НАХОДИМ ID ПОЛЬЗОВАТЕЛЯ С ВВЕДЁННЫМИ ДАННЫМИ
//------------------------------------------------------------------------

function getFindPhysUserQuery(user) {
    var sql = `SELECT client_id FROM clients
                WHERE
                phone_num = '${user.phone}' AND
                password = '${user.pswd}';`;
    return sql;
}

function getFindJurUserQuery(user) {
    var sql = `SELECT client_id FROM clients
                WHERE
                inn = '${user.inn}' AND
                password = '${user.pswd}';`;
    return sql;
}

function getFindUserQuery(user) {
    var type = user.client_type;
    if (type == "phys") {
        return getFindPhysUserQuery(user);
    }
    else if (type == "jur") {
        return getFindJurUserQuery(user);
    }
}

//------------------------------------------------------------------------
//                           ВАЛИДАЦИЯ ВВОДА
//------------------------------------------------------------------------

const validationModule = require("./validation.js");

function validatePhysUserCredentials(user) {
    return validationModule.validatePhone(user.phone) &&
            validationModule.validatePassword(user.pswd);
}

function validateJurUserCredentials(user) {
    return validationModule.validateINN(user.inn) &&
            validationModule.validatePassword(user.pswd);
}

function validateUserCredentials(user) {
    var type = user.client_type;
    if (type == "phys") {
        return validatePhysUserCredentials(user);
    }
    else if (type == "jur") {
        return validateJurUserCredentials(user);
    }
    else {
        return false;
    }
}

//------------------------------------------------------------------------
//                           ХЭНДЛЕР ВХОДА
//------------------------------------------------------------------------

function loginHandler(pool, user, response) {
    // Валидация полученных данных
    var isValid = validateUserCredentials(user);
    if (!isValid) {
        response.sendStatus(400);
        return;
    }
    
    // Составляем и выполняем запрос на получение ID пользователя
    var sql = getFindUserQuery(user);
    pool.query(sql)
        .then(data => {
            if (data[0].length != 1) {
                response.send("Неверно введён логин или пароль");
                return;
            }
            // Если была найдена именно одна запись, то пользователь может зайти
            var userid = data[0][0].client_id;
            response.send(`type=${user.client_type};userid=${userid};`);
            return;
        })
        .catch(err => {
            response.send("Возникла ошибка при регистрации");
            return console.log(err);
        })
    
}