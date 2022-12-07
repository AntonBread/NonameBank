// ФИО
export function formatInputName(nameElement) {
    nameElement.addEventListener("input", (e) => {
        // Делаем первую букву автоматически заглавной
        if (e.target.value.length == 1) {
            e.target.value = e.target.value.toUpperCase();
        }
        // Только кириллические буквы 
        e.target.value = e.target.value.replace(/[^а-яА-ЯёЁ]/g, '');
    });
}

// НОМЕР ТЕЛЕФОНА
export function formatInputPhone(phoneElement) {
    phoneElement.addEventListener("focus", (e) => {
        // Добавляем +7 в начало
        if (e.target.value.length <= 1) {
            e.target.value = "+7";
        }
    });

    phoneElement.addEventListener("keypress", (e) => {
        // Допускается только ввод цифр
        if (!(e.key >= '0' && e.key <= '9')) {
            e.preventDefault();
        }
    });

    phoneElement.addEventListener("input", (e) => {
        var len = e.target.value.length;
        // +7 нельзя удалить.
        if (len <= 1) {
            e.target.value = "+7"
        }
    });
}

// ИНН
export function formatInputINN(innElement) {
    innElement.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// НАЗВАНИЕ ОРГАНИЗАЦИИ
export function formatInputOrgname(ogrnameElement) {
    ogrnameElement.addEventListener("input", (e) => {
        // Только кириллические буквы и некоторые символы
        e.target.value = e.target.value.replace(/[^а-яА-ЯёЁ\s\.,"'`]/g, '');
    });
}

// ПАСПОРТ
export function formatInputPassport(passportElement) {
    passportElement.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// АДРЕС
export function formatInputAddr(addrElement) {
    addrElement.addEventListener("input", (e) => {
        // Только кириллические буквы и некоторые символы
        e.target.value = e.target.value.replace(/[^а-яА-ЯёЁ\s\.,"'`]/g, '');
    });
}

// ПАРОЛЬ
export function formatInputPassword(passwordElement) {
    passwordElement.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[\s_\.,'"`+*-\/=]/g, '');
    });
}