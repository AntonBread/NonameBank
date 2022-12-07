export function formatSum(sum) {
    var len = sum.length;
    // Цикл для добавления пробелов между каждыми тремя разрядами числа
    for (let i = len - 3; i >= 0; i -= 3) {
        sum = sum.slice(0, i) + " " + sum.substring(i);
    }
    return sum;
}

export function getMonthPostfix(months) {
    var str;
    if ((months >= 10 && months <= 20) || (months % 10 >= 5) || (months % 10 == 0)) {
        str = "месяцев";
    }
    else if (months % 10 == 1) {
        str = "месяц";
    }
    else if (months % 10 >= 2 && months % 10 <= 4) {
        str = "месяца";
    }
    return str;
}

export function formatPhoneNum(phone) {
    var countryCode = "+7"
    var areaCode = phone.slice(0, 3);
    var telePrefix = phone.slice(3, 6);
    var lineNum = phone.slice(6);
    phone = `${countryCode} (${areaCode}) ${telePrefix} ${lineNum}`;
    return phone;
}

export function getPropertyTitle(prop, client_type) {
    var title;
    switch (prop) {
        case "last_name":
            if (client_type == "phys") {
                title = "Фамилия";
            }
            else if (client_type == "jur") {
                title = "Фамилия учредителя";
            }
            break;

        case "first_name":
            if (client_type == "phys") {
                title = "Имя";
            }
            else if (client_type == "jur") {
                title = "Имя учредителя";
            }
            break;

        case "patronymic":
            if (client_type == "phys") {
                title = "Отчество";
            }
            else if (client_type == "jur") {
                title = "Отчество учредителя";
            }
            break;

        case "passport_serial":
            title = "Серия паспорта";
            break;

        case "passport_num":
            title = "Номер паспорта";
            break;

        case "inn":
            title = "ИНН";
            break;

        case "orgname":
            title = "Название организации";
            break;

        case "phone_num":
            title = "Номер телефона";
            break;
    }
    return title;
}