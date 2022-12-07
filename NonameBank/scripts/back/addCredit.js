module.exports = {
    addCreditHandler: addCreditHandler
}

//------------------------------------------------------------------------
//                        ДОБАВЛЕНИЕ КРЕДИТА В БД
//------------------------------------------------------------------------

function getAddCredtiQuery(data) {
    var sql = `INSERT INTO credits(
            client_id,
            sum_init,
            sum_current,
            interest,
            date_start,
            date_end)
        VALUES(
            ${data.client_id},
            ${data.sum_init}.00,
            ${data.sum_init}.00,
            ${data.interest},
            '${data.date_start}',
            '${data.date_end}')`;
    return sql;
}

function addCreditHandler(pool, data, response) {
    var isValid = validateCreditData(data);
    if (!isValid) {
        response.sendStatus(400);
        return;
    }

    var sql = getAddCredtiQuery(data);
    pool.query(sql)
        .then(results => {
            if (results[0].affectedRows == 1) {
                response.send("Кредит успешно оформлен!");
                return;
            }
            else {
                response.send("Возникла ошибка при оформлении кредита.");
                return;
            }
        })
        .catch(err => {
            response.sendStatus(500);
            return console.log(err);
        })

}

//------------------------------------------------------------------------
//                        ВАЛИДАЦИЯ ПОЛЕЙ ОБЪЕКТА
//------------------------------------------------------------------------

const validationModule = require("./validation.js");

function validateCreditData(data) {
    return validationModule.validateCreditSum(data.sum_init) &&
        validationModule.validateCreditInterest(data.interest) &&
        validationModule.validateCreditDates(data.date_start, data.date_end);
}
