window.addEventListener('load', function authStartExec() {
    initCookies();
    checkQueryParams();
    initTypeButtons();
    initSubtypeButtons();
    initApplyButton();
}, false)

import * as creditTypesModule from "./creditTypes.js";
var creditTypesArray = creditTypesModule.creditTypesInfo;

//------------------------------------------------------------------------
//                        ПАРАМЕТРЫ СТРОКИ ПОИСКА
//------------------------------------------------------------------------

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const TYPE = params.type;
const SUBTYPE = params.sub;
export const CREDIT_INFO = creditTypesArray.find(obj => obj.subtype === SUBTYPE);
console.log(CREDIT_INFO);

// Перезапускаем страницу с параметрами
function checkQueryParams() {
    if (TYPE == null || SUBTYPE == null) {
        var type = client_type;
        var subtype;
        for (let i = 0; i < creditTypesArray.length; i++) {
            if (creditTypesArray[i].type == client_type) {
                subtype = creditTypesArray[i].subtype;
                break;
            }
        }
        window.open(`http://localhost:3000/?type=${type}&sub=${subtype}`, "_self");
    }
}

//------------------------------------------------------------------------
//                        ПРОВЕРКА КУКИ И ВХОД
//------------------------------------------------------------------------

var client_type;
var userid;

function initCookies() {
    if (document.cookie == '') {
        client_type = "phys";
        initAuthButtons();
        return;
    }
    var cookies = document.cookie.split(';');
    client_type = cookies[0].split('=')[1];
    userid = cookies[1].split('=')[1];
    console.log(`CLIENT: ${client_type}; USERID: ${userid}`);
    initUserMenu();
}

//------------------------------------------------------------------------
//                        КНОПКИ ТИПА КРЕДИТА
//------------------------------------------------------------------------

function initTypeButtons() {
    var btnPhys = document.getElementById("btn-credit-type-phys");
    var btnJur = document.getElementById("btn-credit-type-jur");

    btnPhys.addEventListener("click", (e) => {
        var subtype = creditTypesArray.find(obj => obj.type === "phys").subtype;
        window.open(`http://localhost:3000/?type=phys&sub=${subtype}`, "_self");
    });

    btnJur.addEventListener("click", (e) => {
        var subtype = creditTypesArray.find(obj => obj.type === "jur").subtype;
        window.open(`http://localhost:3000/?type=jur&sub=${subtype}`, "_self");
    })

    setSelectedTypeButtonStyle();
}

function setSelectedTypeButtonStyle() {
    var borderDef = "3px solid #ccc";
    var btn;
    if (TYPE == "phys") {
        btn = document.getElementById("btn-credit-type-phys");
    }
    else {
        btn = document.getElementById("btn-credit-type-jur");
    }
    btn.style.borderBottom = borderDef;
}


//------------------------------------------------------------------------
//                           МЕНЮ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

import * as userMenuModule from "./userHeaderMenu.js";

function initUserMenu() {
    var userMenu = document.getElementById("user-menu-wrapper");
    userMenu.style.display = "flex";

    userMenuModule.initUserGreet(document.getElementById("user-greet"), client_type, userid);
    userMenuModule.initMyCreditsButton(document.getElementById("btn-my-credits"));
    userMenuModule.initLogoutButton(document.getElementById("btn-logout"));
}

function initAuthButtons() {
    var authBtns = document.getElementById("auth-btns-wrapper");
    authBtns.style.display = "flex";
}

//------------------------------------------------------------------------
//                        КНОПКИ ПОДТИПА КРЕДИТА
//------------------------------------------------------------------------

function initSubtypeButtons() {
    var btnWrapper = document.getElementById("credit-subtype-selector-wrapper");
    var btnCount = 0;
    creditTypesArray.forEach(creditInfo => {
        // Выносим на страницу только кнопки текущего типа
        if (creditInfo.type == TYPE) {
            btnCount++;
            var btn = createSubtypeButton(creditInfo);
            btnWrapper.appendChild(btn);
            btn.addEventListener("click", subTypeButtonListener);

            // Если кнопка совпадает с подтипом в запросе, выделяем её цветом
            if (creditInfo.subtype == SUBTYPE) {
                btn.style.background = "var(--btn-credit-subtype-selected)"
                btn.style.color = "var(--btn-credit-subtype-selected-text)";
            }
        }
    });
    // Устанавливаем ширину грида в соответствии с количеством кнопок
    var str = "";
    for (let i = 0; i < btnCount; i++) {
        str += "1fr ";
    }
    btnWrapper.style.gridTemplateColumns = str.trim();
}

function createSubtypeButton(creditInfo) {
    var btn = document.createElement("button");
    btn.classList.add("btn-credit-subtype");
    btn.classList.add(`btn-credit-subtype-${creditInfo.type}`);
    btn.id = `btn-credit-subtype-${creditInfo.type}-${creditInfo.subtype}`;
    btn.innerHTML = creditInfo.name;
    return btn;
}

function subTypeButtonListener(e) {
    var subtype = creditTypesArray.find(obj => obj.name === e.target.innerHTML).subtype;
    window.open(`http://localhost:3000/?type=${TYPE}&sub=${subtype}`, "_self");
}

//------------------------------------------------------------------------
//                        ОФОРМЛЕНИЕ КРЕДИТА
//------------------------------------------------------------------------

function initApplyButton() {
    if (userid == undefined) {
        disableApplyButton("Необходима авторизация");
    }
    else if (TYPE != client_type) {
        disableApplyButton("Нельзя оформить кредит не своего типа");
    }
    else {
        enableApplyButton();
    }
}

function enableApplyButton() {
    var btn = document.getElementById("btn-credit-apply");
    // Меняем стиль на "включённый"
    btn.style.background = "var(--btn-credit-apply-background-enabled)";
    btn.style.color = "#f5f5f5";
    document.documentElement.style.setProperty("--btn-credit-apply-background-hover", "#de3131");
    document.documentElement.style.setProperty("--btn-credit-apply-background-active", "#f33636");
    // Включаем нажатия
    btn.removeAttribute("disabled");
    // Убираем тултип
    btn.setAttribute("auth-hint", "");

    btn.addEventListener("click", applyForCredit);
}

function disableApplyButton(msg) {
    var btn = document.getElementById("btn-credit-apply");
    // Меняем стиль на "выключенный"
    btn.style.background = "var(--btn-credit-apply-background-disabled)";
    btn.style.color = "black";
    document.documentElement.style.setProperty("--btn-credit-apply-background-hover", "#888");
    document.documentElement.style.setProperty("--btn-credit-apply-background-active", "#888");
    // Выключаем нажатия
    btn.disabled = "true";
    // Устанавливаем тултип
    btn.setAttribute("auth-hint", msg);
}

async function applyForCredit() {
    // Пользователь переходит на другую страницу, подтверждает все данные, подтверждает оформление кредита
    // и только после этого кредит добавляется в БД
    var calculator = await import("./calculator.js")
    window.open(`http://localhost:3000/confirm?sum=${calculator.currentSum}&months=${calculator.currentTime}&interest=${calculator.currentInterest}`, "_self");
}