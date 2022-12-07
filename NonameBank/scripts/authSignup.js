window.addEventListener('load', function signupStartExec() {
    initRadioButtons();
    setClientTypePhys();
    initFormInputs();
    initSubmitButton();
    initCancelButton();
}, false)

//------------------------------------------------------------------------
//                      ПЕРЕКЛЮЧЕНИЕ ФИЗ/ЮР ЛИЦО
//------------------------------------------------------------------------

function initRadioButtons() {
    var btnPhys = document.getElementById("input-client-type-phys");
    var btnJur = document.getElementById("input-client-type-jur");

    btnPhys.addEventListener("click", setClientTypePhys);
    btnJur.addEventListener("click", setClientTypeJur);
}

function setClientTypePhys() {
    var physElems = Array.from(document.getElementsByClassName("input-phys"));
    var jurElems = Array.from(document.getElementsByClassName("input-jur"));

    physElems.forEach(e => enableElement(e));
    jurElems.forEach(e => disableElement(e));
    updateHints();
}

function setClientTypeJur() {
    var physElems = Array.from(document.getElementsByClassName("input-phys"));
    var jurElems = Array.from(document.getElementsByClassName("input-jur"));

    physElems.forEach(e => disableElement(e));
    jurElems.forEach(e => enableElement(e));
    updateHints();
}

function disableElement(e) {
    e.style.display = "none";
    if (e.tagName == "input") {
        e.value = "";
        e.removeAttribute("required");
    }
    e.disabled = "true";
}

function enableElement(e) {
    e.style.display = "block";
    if (e.tagName == "input") {
        e.value = "";
        e.required = "true";
    }
    e.removeAttribute("disabled");
}

function updateHints() {
    var firstname = document.getElementById("input-hint-firstname");
    var lastname = document.getElementById("input-hint-lastname");
    var patronymic = document.getElementById("input-hint-patronymic");
    var address_reg = document.getElementById("input-hint-address-reg");
    var address_fact = document.getElementById("input-hint-address-fact");
    var type = document.forms["auth-form"].elements["client-type"][0].checked ? "phys" : "jur";
    switch (type) {
        case "phys":
            firstname.innerHTML = "Имя";
            lastname.innerHTML = "Фамилия";
            patronymic.innerHTML = "Отчество";
            address_reg.innerHTML = "Адрес регистрации";
            address_fact.innerHTML = "Адрес проживания"
            break;
        case "jur":
            firstname.innerHTML = "Имя учредителя";
            lastname.innerHTML = "Фамилия учредителя";
            patronymic.innerHTML = "Отчество учредителя";
            address_reg.innerHTML = "Юридический адрес";
            address_fact.innerHTML = "Фактический адрес";
            break;
    }
}

//------------------------------------------------------------------------
//                        ФОРМАТ ПОЛЕЙ ВВОДА
//------------------------------------------------------------------------

function initFormInputs() {
    import("./authFormat.js").then(formatModule => {
        initNameInputs(formatModule);
        initPassportInputs(formatModule);
        initJurInputs(formatModule);
        initAddrInputs(formatModule);
        initPhoneInput(formatModule);
        initPasswordInputs(formatModule);
    });
}

function initNameInputs(formatModule) {
    var names = Array.from(document.getElementsByClassName("input-name"));
    names.forEach(name => formatModule.formatInputName(name));
}

function initPassportInputs(formatModule) {
    var passport = Array.from(document.getElementsByClassName("input-passport"));
    passport.forEach(p => formatModule.formatInputPassport(p));     // p – номер паспорта, затем серия паспорта
}

function initJurInputs(formatModule) {
    var inn = document.getElementById("input-inn");
    var orgname = document.getElementById("input-orgname");
    formatModule.formatInputINN(inn);
    formatModule.formatInputOrgname(orgname);
}

function initAddrInputs(formatModule) {
    var addrs = Array.from(document.getElementsByClassName("input-addr"));
    addrs.forEach(addr => formatModule.formatInputAddr(addr))
}

function initPhoneInput(formatModule) {
    var phone = document.getElementById("input-phone");
    formatModule.formatInputPhone(phone);
}

function initPasswordInputs(formatModule) {
    var pswd = document.getElementById("input-password");
    var pswdConfirm = document.getElementById("input-password-confirm");
    formatModule.formatInputPassword(pswd);
    formatModule.formatInputPassword(pswdConfirm);
}

//------------------------------------------------------------------------
//                       ОТПРАВКА ФОРМЫ РЕГИСТРАЦИИ
//------------------------------------------------------------------------

function initSubmitButton() {
    var btn = document.getElementById("btn-signup-submit");
    btn.addEventListener("click", submitSignup);
}

async function submitSignup(e) {
    e.target.disabled = "true";
    e.target.style.background = "#888";
    var form = document.forms["auth-form"];

    var validationModule = await import("./authValidation.js");
    var isValid = validationModule.validateSignupForm(form);

    if (!isValid) {
        e.target.removeAttribute("disabled");
        e.target.style.background = "#b42424";
        setResultHintText("Ошибка в форме регистрации");
        window.scrollTo(0, 0);
        return;
    }

    var parcel = createSignupRequestParcel(form);
    var request = new XMLHttpRequest();
    request.open("POST", "/signup", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", signupResponseListener);
    request.send(parcel);
}

// Установка сообщения о результате запроса
function setResultHintText(msg) {
    var resultHint = document.getElementById("auth-submit-result");
    resultHint.style.display = "block";
    resultHint.innerHTML = msg;
}

function createSignupRequestParcel(form) {
    var client_type = (form.elements["client-type"][0].checked) ? "phys" : "jur";
    var parcel;

    switch (client_type) {
        case "phys":
            parcel = JSON.stringify({
                client_type: client_type,
                passport_num: form.elements["input-passport-num"].value,
                passport_serial: form.elements["input-passport-serial"].value,
                firstname: form.elements["input-firstname"].value,
                lastname: form.elements["input-lastname"].value,
                patronymic: form.elements["input-patronymic"].value,
                addr_reg: form.elements["input-address-reg"].value,
                addr_fact: form.elements["input-address-fact"].value,
                phone: form.elements["input-phone"].value.slice(2),
                pswd: form.elements["input-password"].value
            });
            break;

        case "jur":
            parcel = JSON.stringify({
                client_type: client_type,
                inn: form.elements["input-inn"].value,
                orgname: form.elements["input-orgname"].value,
                firstname: form.elements["input-firstname"].value,
                lastname: form.elements["input-lastname"].value,
                patronymic: form.elements["input-patronymic"].value,
                addr_reg: form.elements["input-address-reg"].value,
                addr_fact: form.elements["input-address-fact"].value,
                phone: form.elements["input-phone"].value.slice(2),
                pswd: form.elements["input-password"].value
            });
            break;
    }

    return parcel;
}

function signupResponseListener(e) {
    var response = e.target.response;

    setResultHintText(response);
    window.scrollTo(0, 0);

    // При успешной регистрации после короткой паузы происходит возврат на главную страницу
    if (response == "Вы успешно зарегистрированы") {
        setTimeout(function () {
            window.open("http://localhost:3000/", "_self");
        }, 2500);
    }
}

//------------------------------------------------------------------------
//                              КНОПКА ОТМЕНЫ
//------------------------------------------------------------------------

function initCancelButton() {
    var btn = document.getElementById("btn-signup-cancel");
    btn.addEventListener("click", () => {
        window.open("http://localhost:3000", "_self");
        return false;
    });
}