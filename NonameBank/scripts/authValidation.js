//------------------------------------------------------------------------
//                         ВАЛИДАЦИЯ ФОРМЫ ВХОДА
//------------------------------------------------------------------------

export function validateLoginForm(form) {
    if (form.elements["client-type"][0].checked) {
        return validatePhysLoginForm(form);
    }
    else if (form.elements["client-type"][1].checked) {
        return validateJurLoginForm(form);
    }
    return false;
}

function validatePhysLoginForm(form) {
    return validatePhone(form.elements["input-phone"].value.slice(2)) &&
        validatePassword(form.elements["input-password"].value);
}

function validateJurLoginForm(form) {
    return validateINN(form.elements["input-inn"].value) &&
        validatePassword(form.elements["input-password"].value);
}

//------------------------------------------------------------------------
//                         ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ
//------------------------------------------------------------------------

export function validateSignupForm(form) {
    if (form.elements["client-type"][0].checked) {
        return validatePhysSignupForm(form);
    }
    else if (form.elements["client-type"][1].checked) {
        return validateJurSignupForm(form);
    }
    return false;
}

function validatePhysSignupForm(form) {
    return validateName(form.elements["input-firstname"].value) &&
        validateName(form.elements["input-lastname"].value) &&
        validateName(form.elements["input-patronymic"].value) &&
        validatePassport(form.elements["input-passport-num"].value, form.elements["input-passport-serial"].value) &&
        validateAddr(form.elements["input-address-reg"].value) &&
        validateAddr(form.elements["input-address-fact"].value) &&
        validatePhone(form.elements["input-phone"].value.slice(2)) &&
        validatePasswordConfirm(form.elements["input-password"].value, form.elements["input-password-confirm"].value);
}

function validateJurSignupForm(form) {
    return validateName(form.elements["input-firstname"].value) &&
        validateName(form.elements["input-lastname"].value) &&
        validateName(form.elements["input-patronymic"].value) &&
        validateINN(form.elements["input-inn"].value) &&
        validateOrgname(form.elements["input-orgname"].value) &&
        validateAddr(form.elements["input-address-reg"].value) &&
        validateAddr(form.elements["input-address-fact"].value) &&
        validatePhone(form.elements["input-phone"].value.slice(2)) &&
        validatePasswordConfirm(form.elements["input-password"].value, form.elements["input-password-confirm"].value);
}

//------------------------------------------------------------------------
//                         ОБЩИЕ ФУНКЦИИ ВАЛИДАЦИИ
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
    if (pswd.length < 3 || pswd.length > 64) {
        return false;
    }

    return true;
}

function validatePasswordConfirm(pswd, pswdConfirm) {
    if (!validatePassword(pswd) || !validatePassword(pswdConfirm))
        return false;

    return (pswd == pswdConfirm);
}