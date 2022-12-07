const http = require("http");
http.createServer(function (request, response) {

}).listen(3000, "127.0.0.1", function () {
    console.log("Сервер начал прослушивание запросов на порту 3000");
});

const mysql = require("mysql2");
const express = require("express");
const router = express.Router();

const app = express();
const jsonParser = express.json();

// Подключаемся к БД
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "bankdb",
    password: "admin"
}).promise();

// Добавляем на сервер скрипты и css
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/scripts'));

//------------------------------------------------------------------------
//                             МАРШРУТИЗАЦИЯ
//------------------------------------------------------------------------

// Запускаем главную страницу сайта
router.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Запускаем страницу входа в учётную запись
router.get("/login", function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

// Запускаем страницу регистрации
router.get("/signup", function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

// Запускаем страницу подтверждения кредита
router.get("/confirm", function (req, res) {
    res.sendFile(__dirname + '/confirm.html');
})

// Запускаем страницу "мои кредиты"
router.get("/credits", function (req, res) {
    res.sendFile(__dirname + "/credits.html");
});


//------------------------------------------------------------------------
//                    ОБРАБОТКА ЗАПРОСА НА РЕГИСТРАЦИЮ
//------------------------------------------------------------------------

const signupModule = require("./scripts/back/signup.js");

router.post("/signup", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    signupModule.signupHandler(pool, req.body, res);
});


//------------------------------------------------------------------------
//                    ОБРАБОТКА ЗАПРОСА НА ВХОД
//------------------------------------------------------------------------

const loginModule = require("./scripts/back/login.js");

router.post("/login", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    loginModule.loginHandler(pool, req.body, res);
});

//------------------------------------------------------------------------
//                 ЗАПРОС НА ПОЛУЧЕНИЕ ИМЕНИ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

const getDataModule = require("./scripts/back/getData.js");

router.post("/getName", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    getDataModule.getUserNameHandler(pool, req.body, res);
});

//------------------------------------------------------------------------
//   ЗАПРОС НА ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ДЛЯ ПОДТВЕРЖДЕНИЯ КРЕДИТА
//------------------------------------------------------------------------

router.post("/getConfirmationData", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    getDataModule.getConfirmationDataHandler(pool, req.body, res);
});

//------------------------------------------------------------------------
//                     ЗАПРОС НА ОФОРМЛЕНИЕ КРЕДИТА
//------------------------------------------------------------------------

const addCreditModule = require("./scripts/back/addCredit.js");

router.post("/addCredit", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    addCreditModule.addCreditHandler(pool, req.body, res);
});

//------------------------------------------------------------------------
//           ЗАПРОС НА ПОЛУЧЕНИЕ МАССИВА КРЕДИТОВ ПОЛЬЗОВАТЕЛЯ
//------------------------------------------------------------------------

router.post("/getCredits", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    getDataModule.getCreditsArrayHandler(pool, req.body.client_id, res);
});

//------------------------------------------------------------------------
//                 ЗАПРОС НА СОВЕРШЕНИЕ ПЛАТЕЖА ПО КРЕДИТУ
//------------------------------------------------------------------------

const payCreditModule = require("./scripts/back/payCredit.js");

router.post("/payCredit", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    payCreditModule.payCredtiHandler(pool, req.body, res);
});



//------------------------------------------------------------------------
//                        ЗАПУСКАЕМ ШАРМАНКУ
//------------------------------------------------------------------------

app.use('/', router);

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});