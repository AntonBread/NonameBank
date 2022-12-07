export function formatTimeAmount(months) {
    var years = Math.trunc(months / 12);
    months = Math.trunc(months % 12);
    var timeString = new String();
    if (years != 0) {
        timeString += years;
        if ((years >= 10 && years <= 20) || (years % 10 == 5) || (years % 10 == 0))
            timeString += " лет";
        else if (years % 10 == 1)
            timeString += " год";
        else if (years % 10 >= 2)
            timeString += " года";
    }
    if (months != 0) {
        timeString += " " + months;
        if (months >= 5)
            timeString += " месяцев";
        else if (months == 1)
            timeString += " месяц";
        else if (months >= 2)
            timeString += " месяца";
    }
    return timeString;
}

export function formatSumAmount(sum) {
    var isInteger = (sum % 1 == 0);
    sum = sum.toString();
    var len = sum.length;
    if (!isInteger) {   // Для дробных чисел не отделяем дробную часть пробелом
        len -= 3;
    }
    for (let i = len - 3; i >= 0; i -= 3) {
        sum = sum.slice(0, i) + " " + sum.substring(i);
    }

    return sum;
}

export function sumManualFormatter(e) {
    // Ввод только 9 символов
    if (e.target.value.length > 9) {
        e.target.value = e.target.value.slice(0, 9);
    }
    // Ввод только цифр
    e.target.value = e.target.value.replace(/\D/g, '');
}

export function timeManualFormatter(e) {
    // Ввод только 3 символов
    if (e.target.value.length > 3) {
        e.target.value = e.target.value.slice(0, 3);
    }
    // Ввод только цифр
    e.target.value = e.target.value.replace(/\D/g, '');

    updateManualTimeEnding(e.target.value, document.getElementById("manual-time-hint"));
}

export function updateManualTimeEnding(months, targetElement) {
    if ((months >= 10 && months <= 20) || (months % 10 >= 5) || (months % 10 == 0)) {
        targetElement.innerHTML = "месяцев";
    }
    else if (months % 10 == 1) {
        targetElement.innerHTML = "месяц";
    }
    else if (months % 10 >= 2 && months % 10 <= 4) {
        targetElement.innerHTML = "месяца";
    }
}