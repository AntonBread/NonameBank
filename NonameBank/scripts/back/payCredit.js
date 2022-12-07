module.exports = {
    payCredtiHandler: payCredtiHandler
}


//------------------------------------------------------------------------
//                       СОСТАВЛЕНИЕ SQL ЗАПРОСОВ
//------------------------------------------------------------------------

function getSelectCreditSumQuery(data) {
    var sql = `SELECT sum_current FROM credits
                WHERE
                credit_id = ${data.credit_id} AND
                client_id = ${data.client_id};`;
    return sql;
}

function getPayCreditQuery(data) {
    // Перед оплатой начисляются проценты
    var sql = `UPDATE credits
                SET sum_current = sum_current * ${data.interest}, sum_current = sum_current - ${data.pay_sum}
                WHERE
                credit_id = ${data.credit_id} AND
                client_id = ${data.client_id};`;
    return sql;
}

function getDeleteCreditQuery(data) {
    var sql = `DELETE FROM credits
                WHERE
                credit_id = ${data.credit_id} AND
                client_id = ${data.client_id};`;
    return sql;
}


//------------------------------------------------------------------------
//                          ВЫПОЛНЕНИЕ ОПЛАТЫ
//------------------------------------------------------------------------

function payCredtiHandler(pool, data, response) {
    var isValid = validatePayData(data);
    if (!isValid) {
        response.sendStatus(400);
        return;
    }
    
    data.interest = (Number(data.interest) / 1200 + 1);
    var sql = getPayCreditQuery(data);
    pool.query(sql)
        .then(results => {
            if (results[0].affectedRows != 1) {
                response.send({ success: false, msg: "Оплата не прошла: кредит не найден в базе" });
                return;
            }
            creditDeletionHandler(pool, data, response);
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        });
    return;
}

function creditDeletionHandler(pool, data, response) {
    var sql = getSelectCreditSumQuery(data);
    pool.query(sql)
        .then(searchResults => {
            var sum = searchResults[0][0].sum_current;
            // Если после оплаты, текущая сумма кредита меньше или равна 0
            // То кредит считается погашенным, можно удалить его из БД
            var deleted = false;
            if (sum <= 0) {
                deleted = true;
                sql = getDeleteCreditQuery(data);
                pool.query(sql)
                    .then(results => {
                        response.send({ success: true, msg: "Кредит успешно погашен!" });
                        return;
                    })
                    .catch(err => {
                        response.sendStatus(500);
                        return console.log(err);
                    });
            }
            if (deleted) {
                return;
            }
            response.send({ success: true, msg: "Оплата прошла успешно!", sum_new: sum });
            return;
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        });
}

//------------------------------------------------------------------------
//                       ВАЛИДАЦИЯ ПОЛЕЙ ОБЪЕКТА
//------------------------------------------------------------------------

const validationModule = require("./validation.js");

function validatePayData(data) {
    return validationModule.validateCreditPaySum(data.pay_sum) &&
        validationModule.validateCreditInterest(data.interest);
}