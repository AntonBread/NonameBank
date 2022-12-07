window.addEventListener('load', function authStartExec() {
    initCookies();
    initQueryParams();
    displayConfirmationData();
    initConfirmButton();
    initCancelButton();
}, false)

var client_type;
var userid;

function initCookies() {
    // Если кукисов нет, то пользователь не авторизован
    // Разворачиваем его на главную страницу
    if (document.cookie == '') {
        window.open("http://localhost:3000", "_self");
        return;
    }

    var cookies = document.cookie.split(';');
    client_type = cookies[0].split('=')[1];
    userid = cookies[1].split('=')[1];
    console.log(`CLIENT: ${client_type}; USERID: ${userid}`);
}

import * as formatModule from "./confirmFormat.js";

// Данные о кредите получаем из строки поиска
var creditSum;
var creditMonths;
var creditInterest;

function initQueryParams() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    creditSum = params.sum;
    creditMonths = params.months;
    creditInterest = params.interest;

    addDataToList("Сумма кредита", formatModule.formatSum(creditSum), '₽');
    addDataToList("Срок оформления кредита", creditMonths, formatModule.getMonthPostfix(creditMonths));
    addDataToList("Процентная ставка", creditInterest, "% годовых");
}

// Данные о пользователе получаем из БД
function displayConfirmationData() {
    var parcel = JSON.stringify({ client_type: client_type, userid: userid });
    var request = new XMLHttpRequest();
    request.open("POST", "/getConfirmationData", true);
    request.setRequestHeader("Content-Type", "application/json");
    // Запускаем обработчик ответа от сервера
    request.addEventListener("load", function () {
        var response = JSON.parse(request.response);
        response.phone_num = formatModule.formatPhoneNum(response.phone_num); // Номер телефона хранится в БД в "сыром" виде, необходим формат

        for (const property in response) {
            var title = formatModule.getPropertyTitle(property, client_type);
            addDataToList(title, response[property], '');
        }
    });
    request.send(parcel);
}

//------------------------------------------------------------------------
//                      ФУНКЦИЯ ОФОРМЛЕНИЯ КРЕДИТА
//------------------------------------------------------------------------

function initConfirmButton() {
    var btn = document.getElementById("btn-credit-confirm");
    btn.addEventListener("click", () => {
        var parcel = JSON.stringify({
            client_id: userid,
            sum_init: creditSum,
            interest: creditInterest,
            date_start: getDateStart(),
            date_end: getDateEnd(creditMonths)
        });
        var request = new XMLHttpRequest();
        request.open("POST", "/addCredit", true);
        request.setRequestHeader("Content-Type", "application/json");
        // Запускаем обработчик ответа от сервера
        request.addEventListener("load", creditResponseListener);
        request.send(parcel);
    });
}

function creditResponseListener(e) {
    var response = e.target.response;
    var resultDiv = document.getElementById("confirm-result");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = response;
    window.scrollTo(0, 0);

    // В случае успешного оформления кредита происходит возврат на главную страницу после короткой паузы
    // Кнопка оформления также отключается
    if (response == "Кредит успешно оформлен!") {
        disableCreditConfirmButton();
        setTimeout(() => window.open("http://localhost:3000", "_self"), 5000);
    }
}

function getDateStart() {
    var currentDate = new Date();
    return dateToSqlDate(currentDate);
}

function getDateEnd(months) {
    var startDate = new Date();
    var endDate = addMonths(startDate, months);
    return dateToSqlDate(endDate);
}

function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

function dateToSqlDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;   // В JS отсчёт идёт с 0, в MySQL с 1
    month = month.toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    var day = date.getDate();

    var sqlDate = `${year}-${month}-${day}`;
    return sqlDate
}

//------------------------------------------------------------------------
//                    ФУНКЦИЯ ДОБАВЛЕНИЯ ДАННЫХ СПИСКА
//------------------------------------------------------------------------

function addDataToList(title, data, postfix) {
    var wrapper = document.getElementById("data-wrapper");
    var titleDiv = document.createElement("div");
    var dataDiv = document.createElement("div");
    var rowDivisor = document.createElement("div")
    rowDivisor.className = "row-divisor";
    titleDiv.innerHTML = `${title}`;
    dataDiv.innerHTML = `${data} ${postfix}`;
    dataDiv.style.justifyContent = "flex-end";
    wrapper.appendChild(titleDiv);
    wrapper.appendChild(dataDiv);
    wrapper.appendChild(rowDivisor);
}

//------------------------------------------------------------------------
//                              КНОПКА ОТМЕНЫ
//------------------------------------------------------------------------

function initCancelButton() {
    var btn = document.getElementById("btn-credit-cancel");
    btn.addEventListener("click", () => {
        window.open("http://localhost:3000", "_self");
        return false;
    });
}

function disableCreditConfirmButton() {
    var btn = document.getElementById("btn-credit-confirm");
    btn.disabled = "true";
    btn.style.background = "#666";
}