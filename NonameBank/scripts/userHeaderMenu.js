export function initUserGreet(greetSpan, type, userid) {
    var parcel = JSON.stringify({ client_type: type, userid: userid });
    var request = new XMLHttpRequest();
    request.open("POST", "/getName", true);
    request.setRequestHeader("Content-Type", "application/json");
    // Запускаем обработчик ответа от сервера
    request.addEventListener("load", function () {
        var response = request.response;
        greetSpan.innerHTML = "";

        if (type == "phys") {
            greetSpan.innerHTML += "Здравствуйте, "
        }
        // Чтобы имя/название организации не занимало слишком много места, ограничим его 32 символами
        greetSpan.innerHTML += response;
        if (greetSpan.innerHTML.length > 32) {
            greetSpan.innerHTML = greetSpan.innerHTML.substring(0, 32);
            greetSpan.innerHTML += "…";
        }
    });
    request.send(parcel);
}

export function initMyCreditsButton(btn) {
    btn.addEventListener("click", () => {
        window.open("http://localhost:3000/credits", "_self");
        return false;
    })
}

export function initLogoutButton(btn) {
    // Очищаем куки и обновлем страницу
    btn.addEventListener("click", () => {
        if (window.confirm("Вы уверены что хотите выйти?")) {
            var cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                var cookie = cookie.trim();
                var name = cookie.substring(0, cookie.indexOf('='));
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            });
            window.location.reload();
            return false;
        }
    });
}

export function initBackToMenuButton(btn) {
    btn.addEventListener("click", () => {
        window.open("http://localhost:3000", "_self");
        return false;
    });
}