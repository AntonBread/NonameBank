module.exports = {
    validateName: validateName,
    validatePassport: validatePassport,
    validateINN: validateINN,
    validateOrgname: validateOrgname,
    validateAddr: validateAddr,
    validatePhone: validatePhone,
    validatePassword: validatePassword,
    validatePasswordConfirm: validatePasswordConfirm,

    validateCreditSum: validateCreditSum,
    validateCreditInterest: validateCreditInterest,
    validateCreditDates: validateCreditDates,
    validateCreditPaySum: validateCreditPaySum
}

//------------------------------------------------------------------------
//                         ВАЛИДАЦИЯ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

function validateName(name) {
    if (name.match(/[^а-яА-ЯёЁ]/g)) {
        return false;
    }
    if (name.length < 1 || name.length > 32) {
        return false;
    }

    return true;
}

function validatePassport(passNum, passSer) {
    if (passNum.match(/\D/g) || passSer.match(/\D/g)) {
        return false;
    }
    if (passNum.length != 6 || passSer.length != 4) {
        return false;
    }
    
    return true;
}

function validateINN(inn) {
    if (inn.match(/\D/g)) {
        return false;
    }
    if (inn.length != 10) {
        return false;
    }
    
    return true;
}

function validateOrgname(orgname) {
    if (orgname.match(/[^а-яА-ЯёЁ\s\.,"'`]/g)) {
        return false;
    }
    if (orgname.length < 1 || orgname.length > 128) {
        return false;
    }

    return true;
}

function validateAddr(addr) {
    if (addr.match(/[^а-яА-ЯёЁ\s\.,"'`]/g)) {
        return false;
    }
    if (addr.length < 1 || addr.length > 256) {
        return false;
    }

    return true;
}

function validatePhone(phone) {
    if (phone.match(/\D/g)) {
        return false;
    }
    if (phone.length != 10) {
        return false;
    }
    
    return true;
}

function validatePassword(pswd) {
    if (pswd.match(/[\s_\.,'"`+*-\/=]/g)) {
        return false;
    }
    if (pswd.lengh < 3 || pswd.length > 64) {
        return false;
    }
    
    return true;
}

function validatePasswordConfirm(pswd, pswdConfirm) {
    if (!validatePassword(pswd) || !validatePassword(pswdConfirm))
        return false;
    
    return (pswd == pswdConfirm);
}

//------------------------------------------------------------------------
//                         ВАЛИДАЦИЯ КРЕДИТА
//------------------------------------------------------------------------

function validateCreditSum(sum) {
    if (sum.toString().match(/\D/g)) {
        return false;
    }
    if (Number(sum) < 50000 || Number(sum) > 500000000) {
        return false;
    }

    return true;
}

function validateCreditInterest(interest) {
    var interestString = interest.toString();
    if (interestString.match(/[^\d\.]/g)) {
        return false;
    }
    // Проверка что общая длина числа не превышает четырёх символов,
    // а длина дробной части – двух
    if (interestString.replace('.', '').length > 4 || interestString.substring(interestString.indexOf('.') + 1).length > 2) {
            return false;
    }
    if (Number(interest) < 1 || Number(interest) > 100) {
        return false;
    }

    return true;
}

function validateCreditDate(date) {
    var d = new Date(date);
    return (d != "Invalid Date");
}

function validateCreditDates(begin, end) {
    if (!(validateCreditDate(begin) && validateCreditDate(end))) {
        return false;
    }

    // Проверяем, что конец не позже начала
    var d1 = new Date(begin);
    var d2 = new Date(end);
    return (d1.getTime() < d2.getTime());
}

function validateCreditPaySum(sum) {
    var sumString = sum.toString();
    if (sumString.match(/[^\d\.]/g)) {
        return false;
    }
    // Проверка что общая длина числа не превышает 12 символов,
    // а длина дробной части – двух
    var decimalPoint = sumString.indexOf('.');
    if (sumString.length > 12 ) {
            return false;
    }
    if (decimalPoint != -1) {
        if (sumString.substring(decimalPoint+ 1).length > 2) {
            return false;
        }
    }
    if (Number(sum) < 1) {
        return false;
    }

    return true;
}