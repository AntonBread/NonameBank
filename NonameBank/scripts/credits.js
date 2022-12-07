window.addEventListener('load', function authStartExec() {
    // Если кукисов нет, то пользователь не авторизован
    // Разворачиваем его на главную страницу
    if (document.cookie == '') {
        window.open("http://localhost:3000", "_self");
        return;
    }
    initCookies();
    initHeader();
    initCreditList();
    initPayButton();
    initPayInput();
}, false)

import * as helperModule from "./creditsHelper.js";

//------------------------------------------------------------------------
//                              ХЭДЕР + КУКИ
//------------------------------------------------------------------------

var client_type;
var userid;

function initCookies() {
    var cookies = document.cookie.split(';');
    client_type = cookies[0].split('=')[1];
    userid = cookies[1].split('=')[1];
    console.log(`CLIENT: ${client_type}; USERID: ${userid}`);
}

import * as userMenuModule from "./userHeaderMenu.js";

function initHeader() {
    userMenuModule.initUserGreet(document.getElementById("user-greet"), client_type, userid);
    userMenuModule.initBackToMenuButton(document.getElementById("btn-to-main"));
    userMenuModule.initLogoutButton(document.getElementById("btn-logout"));
}

//------------------------------------------------------------------------
//                      ЗАПОЛНЕНИЕ СПИСКА КРЕДИТОВ
//------------------------------------------------------------------------

var credits;
var list;
var pct;    // Процентная ставка по выбранному кредиту в виде 1.xx%

const SelectionState = Object.freeze({
    SELECTED: 1,
    UNSELECTED: 0
});

function initCreditList() {
    list = document.getElementById("credit-list");
    populateCreditList(userid);
}

function populateCreditList(userid) {
    var parcel = JSON.stringify({ client_id: userid });
    var request = new XMLHttpRequest();
    request.open("POST", "/getCredits", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", creditRequestListener);
    request.send(parcel);
}

function creditRequestListener(e) {
    var response = e.target.response;
    credits = JSON.parse(response);
    // Вывод в случае если у пользователя 0 кредитов (повезло, повезло...)
    if (credits.length == 0) {
        var div = document.createElement("div");
        div.className = "credit-info-wrapper";
        div.innerHTML = "У вас пока нет кредитов";
        list.appendChild(div);
    }

    credits.forEach(credit => {
        var entry = helperModule.createCreditListEntry(credit);
        list.appendChild(entry);
    });
}

var selectedIndex;

// Устанавливаетя как listener нажатий на кредит в модуле helper
export function selectCredit(e) {
    var items = Array.from(list.children);
    if (selectedIndex != undefined) {
        // Сначала сбрасываем статус выбора с предыдущего нажато кредита
        setSelection(items[selectedIndex], SelectionState.UNSELECTED);
    }
    else {
        enablePayMenu();
    }
    for (let i = 0; i < items.length; i++) {
        if (items[i] == e.target || Array.from(items[i].children).includes(e.target)) {
            setSelection(items[i], SelectionState.SELECTED);
            selectedIndex = i;
            pct = Number(credits[i].interest) / 1200 + 1
            // Ограничиваем размер оплаты текущей суммой с процентами
            input.max = credits[i].sum_current * pct + 1;
            // Устанавливаем начальное значение формы ввода платежа как ежемесячный платёж
            var months = helperModule.monthDiff(credits[i].date_start, credits[i].date_end);
            input.value = helperModule.getMonthlyPay(credits[i].sum_init, credits[i].interest, months);
        }
    }
}

function setSelection(listItem, state) {
    switch (state) {
        case SelectionState.SELECTED:
            listItem.style.background = "#b42424";
            listItem.style.color = "#f5f5f5"
            break;

        case SelectionState.UNSELECTED:
            listItem.style.background = "#f5f5f5";
            listItem.style.color = "black";
            break;
    }
}

//------------------------------------------------------------------------
//                      МЕНЮ СОВЕРШЕНИЯ ПЛАТЕЖА
//------------------------------------------------------------------------

var input;
var hint;

function enablePayMenu() {
    hint = document.getElementById("credit-pay-hint");
    var menu = document.getElementById("credit-pay-menu");
    hint.style.display = "block";
    menu.style.display = "flex";
}

function initPayButton() {
    var btn = document.getElementById("btn-pay");
    btn.addEventListener("click", () => {
        if (!input.checkValidity() || input.value.length < 1) {
            hint.innerHTML = "Сумма введена неверно";
            hint.style.color = "red";
        }
        else {
            btn.disabled = "true";
            btn.style.background = "#888";
            var parcel = JSON.stringify({
                credit_id: credits[selectedIndex].credit_id,
                client_id: Number(userid),  
                pay_sum: Number(input.value),
                interest: credits[selectedIndex].interest
            });
            var request = new XMLHttpRequest();
            request.open("POST", "/payCredit", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.addEventListener("load", payResultListener);
            request.send(parcel);
        }
    });
}

function payResultListener(e) {
    var response = JSON.parse(e.target.response);
    
    if (response.success) {
        hint.innerHTML = response.msg;
        hint.style.fontSize = "200%";
        hint.style.color = "black";
        setTimeout(() => window.location.reload(), 2000);
    }
    else {
        hint.innerHTML = response.msg;
        hint.style.fontSize = "200%";
        hint.style.color = "red";
    }
}

function initPayInput() {
    input = document.getElementById("input-pay-amount");

    input.onkeydown = function (e) {
        e = e || window.event;
        if (e.key == 'e' || e.key == '+' || e.key == '-' || e.key == ',') {
            return false;
        }
    }
}
