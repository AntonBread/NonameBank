module.exports = {
    signupHandler: signupHandler
}

//------------------------------------------------------------------------
//               ПРОВЕРКА УЖЕ НАЛИЧИЯ ТАКОГО ПОЛЬЗОВАТЕЛЯ В БД
//------------------------------------------------------------------------

function getPhysUserExistsQuery(user) {
    var sql = `SELECT * FROM clients
                WHERE
                passport_num = '${user.passport_num}' OR
                passport_serial = '${user.passport_serial}' OR
                phone_num = '${user.phone}';`;
    return sql;
}

function getJurUserExistsQuery(user) {
    var sql = `SELECT * FROM clients
                WHERE
                inn = '${user.inn}' OR
                orgname = '${user.orgname}' OR
                phone_num = '${user.phone}';`;
    return sql;
}

function getUserExistsQuery(user) {
    var type = user.client_type;
    if (type == "phys") {
        return getPhysUserExistsQuery(user);
    }
    else if (type == "jur") {
        return getJurUserExistsQuery(user);
    }
}

//------------------------------------------------------------------------
//                     ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В БД
//------------------------------------------------------------------------

function getPhysUserInsertQuery(user) {
    var sql = `INSERT INTO clients(
        client_type,
        passport_num,
        passport_serial,
        first_name,
        last_name,
        patronymic,
        address_reg,
        address_actual,
        phone_num,
        password)
    VALUES(
        'phys',
        '${user.passport_num}',
        '${user.passport_serial}',
        '${user.firstname}',
        '${user.lastname}',
        '${user.patronymic}',
        '${user.addr_reg}',
        '${user.addr_fact}',
        '${user.phone}',
        '${user.pswd}'
    );`
    return sql;
}

function getJurUserInsertQuery(user) {
    var sql = `INSERT INTO clients(
        client_type,
        inn,
        orgname,
        first_name,
        last_name,
        patronymic,
        address_reg,
        address_actual,
        phone_num,
        password)
    VALUES(
        'jur',
        '${user.inn}',
        '${user.orgname}',
        '${user.firstname}',
        '${user.lastname}',
        '${user.patronymic}',
        '${user.addr_reg}',
        '${user.addr_fact}',
        '${user.phone}',
        '${user.pswd}'
    );`
    return sql;
}

function signupHandler(pool, user, response) {
    // Прежде всего проверяем валидность полученных данных
    var isValid = validateUserCredentials(user);
    if (!isValid) {
        response.sendStatus(400);
        return;
    }

    // Проверяем что пользователя с такими данными не существует в таблице
    var sql = getUserExistsQuery(user);
    pool.query(sql)
        .then(data => {
            userInsertHandler(pool, data, response, user);
        })
        .catch(err => {
            response.send("Возникла ошибка при регистрации");
            return console.log(err);
        }) 
}

function userInsertHandler(pool, data, response, user) {
    if (data[0].length != 0) {
        response.send("Такой пользователь уже существует");
        return;
    }
    // Проверка пройдена, пользователя можно добавить в БД
    switch (user.client_type) {
        case "phys":
            sql = getPhysUserInsertQuery(user);
            break;

        case "jur":
            sql = getJurUserInsertQuery(user);
            break;
    }
    pool.query(sql)
        .then(() => {
            response.send("Вы успешно зарегистрированы");
            return;
        })
        .catch(err => {
            response.send("Возникла ошибка при регистрации");
            return console.log(err);
        })
}

//------------------------------------------------------------------------
//                           ВАЛИДАЦИЯ ВВОДА
//------------------------------------------------------------------------

const validationModule = require("./validation.js");

function validateGeneralUserCredentials(firstname, lastname, patronymic, addrReg, addrFact, phone, pswd) {
    return validationModule.validateName(firstname) &&
        validationModule.validateName(lastname) &&
        validationModule.validateName(patronymic) &&
        validationModule.validateAddr(addrReg) &&
        validationModule.validateAddr(addrFact) &&
        validationModule.validatePhone(phone) &&
        validationModule.validatePassword(pswd);
}

function validatePhysUserCredentials(user) {
    var firstname = user.firstname;
    var lastname = user.lastname;
    var patronymic = user.patronymic;
    var addrReg = user.addr_reg;
    var addrFact = user.addr_fact;
    var phone = user.phone;
    var pswd = user.pswd;
    var passNum = user.passport_num;
    var passSer = user.passport_serial;
    return validateGeneralUserCredentials(firstname, lastname, patronymic, addrReg, addrFact, phone, pswd) &&
        validationModule.validatePassport(passNum, passSer);

}

function validateJurUserCredentials(user) {
    var firstname = user.firstname;
    var lastname = user.lastname;
    var patronymic = user.patronymic;
    var addrReg = user.addr_reg;
    var addrFact = user.addr_fact;
    var phone = user.phone;
    var pswd = user.pswd;
    var inn = user.inn;
    var orgname = user.orgname;
    return validateGeneralUserCredentials(firstname, lastname, patronymic, addrReg, addrFact, phone, pswd) &&
        validationModule.validateINN(inn) &&
        validationModule.validateOrgname(orgname);
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