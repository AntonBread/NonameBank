window.addEventListener('load', function loginStartExec() {
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
}

function setClientTypeJur() {
    var physElems = Array.from(document.getElementsByClassName("input-phys"));
    var jurElems = Array.from(document.getElementsByClassName("input-jur"));

    physElems.forEach(e => disableElement(e));
    jurElems.forEach(e => enableElement(e));
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

//------------------------------------------------------------------------
//                        ФОРМАТ ПОЛЕЙ ВВОДА
//------------------------------------------------------------------------

function initFormInputs() {
    import("./authFormat.js").then(formatModule => {
        initInnInput(formatModule);
        initPhoneInput(formatModule);
        initPasswordInput(formatModule);
    })
}

function initInnInput(formatModule) {
    var inn = document.getElementById("input-inn");
    formatModule.formatInputINN(inn);
}

function initPhoneInput(formatModule) {
    var phone = document.getElementById("input-phone");
    formatModule.formatInputPhone(phone);
}

function initPasswordInput(formatModule) {
    var password = document.getElementById("input-password");
    formatModule.formatInputPassword(password);
}

//------------------------------------------------------------------------
//                          ОТПРАВКА ФОРМЫ ВХОДА
//------------------------------------------------------------------------

function initSubmitButton() {
    var btn = document.getElementById("btn-login-submit");
    btn.addEventListener("click", submitLogin);
}

async function submitLogin(e) {
    e.target.disabled = "true";
    e.target.style.background = "#888";
    var form = document.forms["auth-form"];

    var validationModule = await import("./authValidation.js");
    var isValid = validationModule.validateLoginForm(form);

    if (!isValid) {
        e.target.removeAttribute("disabled");
        e.target.style.background = "#b42424";
        setResultHintText("Неправильный ввод")
        return;
    }

    var parcel = createLoginRequestParcel(form);
    var request = new XMLHttpRequest();
    request.open("POST", "/login", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", loginResponseListener);
    request.send(parcel);
}

// Установка сообщения о результате запроса
function setResultHintText(msg) {
    var resultHint = document.getElementById("auth-submit-result");
    resultHint.style.display = "block";
    resultHint.innerHTML = msg;
}

function createLoginRequestParcel(form) {
    var client_type = (form.elements["client-type"][0].checked) ? "phys" : "jur";
    var parcel;

    switch (client_type) {
        case "phys":
            parcel = JSON.stringify({
                client_type: client_type,
                phone: form.elements["input-phone"].value.slice(2),
                pswd: form.elements["input-password"].value
            });
            break;

        case "jur":
            parcel = JSON.stringify({
                client_type: client_type,
                inn: form.elements["input-inn"].value,
                pswd: form.elements["input-password"].value
            });
            break;
    }

    return parcel;
}

function loginResponseListener(e) {
    var response = e.target.response;

    // Если ответ пришёл в виде куки – устанавливаем куки и уходим на главную страницу
    if (response.substring(0, 4) == "type") {
        var cookieDivisor = response.indexOf(';') + 1;
        document.cookie = response.substring(0, cookieDivisor);;
        document.cookie = response.substring(cookieDivisor);
        setResultHintText("Успешно!");

        setTimeout(function () {
            window.open("http://localhost:3000/", "_self");
        }, 800);
    }
    // Иначе выводим сообщение об ошибке и повторно включаем кнопку отправки
    else {
        setResultHintText(response);
        var btn = document.getElementById("btn-login-submit");
        btn.removeAttribute("disabled");
        btn.style.background = "#b42424";
    }

    window.scrollTo(0, 0);
}

//------------------------------------------------------------------------
//                              КНОПКА ОТМЕНЫ
//------------------------------------------------------------------------

function initCancelButton() {
    var btn = document.getElementById("btn-login-cancel");
    btn.addEventListener("click", () => {
        window.open("http://localhost:3000", "_self");
        return false;
    });
}