import * as mainModule from "./credits.js";

export function createCreditListEntry(credit) {
    // Получаем необходимые для списка данные из объекта
    var start = formatDate(credit.date_start);
    var end = formatDate(credit.date_end);
    var currSum = formatSum(credit.sum_current);
    var initSum = formatSum(credit.sum_init);

    var wrapper = document.createElement("div");
    var rowbreak = document.createElement("div");
    wrapper.className = "credit-info-wrapper";
    rowbreak.className = "row-break";
    var rowbreak2 = rowbreak.cloneNode(false);
    wrapper.addEventListener("click", mainModule.selectCredit);

    var startDiv = document.createElement("div");
    var endDiv = document.createElement("div");
    var currSumDiv = document.createElement("div");
    var initSumDiv = document.createElement("div");

    startDiv.innerHTML = `Оформлен: ${start}`;
    endDiv.innerHTML = `Целевая дата погашения: ${end}`;
    currSumDiv.innerHTML = `Осталось выплатить: ${currSum}`;
    initSumDiv.innerHTML = `Начальная сумма: ${initSum}`;

    wrapper.appendChild(startDiv);
    wrapper.appendChild(rowbreak);
    wrapper.appendChild(endDiv);
    wrapper.appendChild(rowbreak2);
    wrapper.appendChild(currSumDiv);
    wrapper.appendChild(initSumDiv);

    return wrapper;
}

function formatSum(sum) {
    sum = sum.toString();
    var len = sum.length;
    // Цикл для добавления пробелов между каждыми тремя разрядами числа
    for (let i = len - 6; i >= 0; i -= 3) {
        sum = sum.slice(0, i) + " " + sum.substring(i);
    }

    return sum + " ₽";
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function getMonthlyPay(sum, interest, months) {
    var pct = interest / 12 / 100;
    var payCoeff = (pct * Math.pow((pct + 1), months)) / (Math.pow((1 + pct), months) - 1);
    var monthlyPay = sum * payCoeff;
    return monthlyPay.toFixed(2);
}

export function monthDiff(d1, d2) {
    d1 = new Date(d1);
    d2 = new Date(d2);
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}