import { CREDIT_INFO } from "./main.js";    // Информация о параметрах кредита из main'а
import * as formatModule from "./calculatorFormat.js";
// Функции инициализации
initSumInput();
initTimeInput();
updateOutput();

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//                            СУММА КРЕДИТА
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function initSumInput() {
    initSumHints();
    initSumSlider()
    initSumManual();
}

export var currentSum;

//------------------------------------------------------------------------
//                              ПОЛЗУНОК
//------------------------------------------------------------------------

function initSumSlider() {
    var slider = document.getElementById("calculator-slider-sum");
    updateSumSpan();
    // Ползунок реагирует на движения только при зажатой клавише мыши
    // Это сделано для того, чтобы ввод не менялся от рандомных прохождений курсора над ползунком
    slider.addEventListener("mousedown", enableTrackSumSlider);
    slider.addEventListener("mouseup", disableTrackSumSlider);
    slider.addEventListener("click", () => {
        updateSumSpan();
        updateOutput();
    });
}

function enableTrackSumSlider(e) {
    e.target.addEventListener("mousemove", trackSumSlider);
}

function disableTrackSumSlider(e) {
    e.target.removeEventListener("mousemove", trackSumSlider);
}

function trackSumSlider() {
    updateSumSpan();
    updateOutput();
}

//------------------------------------------------------------------------
//                             РУЧНОЙ ВВОД
//------------------------------------------------------------------------

function initSumManual() {
    var sumSpan = document.getElementById("credit-sum-amount");
    // Ручной ввод при нажатии на сумму
    sumSpan.addEventListener("mousedown", startManualSumInput);
    initSumManualFormatter();
}

function startManualSumInput() {
    var sumSpan = document.getElementById("credit-sum-amount");
    var manualSum = document.getElementById("calculator-manual-sum");
    var startVal = Number(sumSpan.innerHTML.replace(/\D/g, ''));
    sumSpan.style.display = "none";
    manualSum.style.display = "inline-block";
    manualSum.value = startVal;

    // Ползунок выключен во время ручного ввода
    var slider = document.getElementById("calculator-slider-sum");
    slider.disabled = "true";
    // Ручной ввод завершается при нажатии на другую часть страницы
    document.body.addEventListener("click", finishManualSumInput);
}

function finishManualSumInput(e) {
    var sumSpan = document.getElementById("credit-sum-amount");
    var manualSum = document.getElementById("calculator-manual-sum");
    // Нажатия на элемент ввода игнорируются
    if (e.target == manualSum || Array.from(e.target.children).includes(manualSum)) {
        return;
    }
    document.body.removeEventListener("click", finishManualSumInput);

    var sum = Number(manualSum.value);
    if (sum < CREDIT_INFO.sum_low) {
        sum = CREDIT_INFO.sum_low;
    }
    else if (sum > CREDIT_INFO.sum_high) {
        sum = CREDIT_INFO.sum_high;
    }
    currentSum = sum;

    sumSpan.style.display = "inline-block";
    manualSum.style.display = "none";
    sumSpan.innerHTML = formatModule.formatSumAmount(sum);
    updateOutput();

    // Обратно включаем ползунок и устанавливаем его положение в соответствии с новой суммой
    var slider = document.getElementById("calculator-slider-sum");
    slider.removeAttribute("disabled");
    slider.value = Math.trunc(sum / CREDIT_INFO.sum_high * slider.max);
    slider.style.setProperty('--value', slider.value);
}

function initSumManualFormatter() {
    var manualSum = document.getElementById("calculator-manual-sum");
    manualSum.addEventListener("input", formatModule.sumManualFormatter);
}

//------------------------------------------------------------------------
//                              РАЗНОЕ
//------------------------------------------------------------------------

function updateSumSpan() {
    var slider = document.getElementById("calculator-slider-sum");
    var mult = slider.value / slider.max;
    var sum = CREDIT_INFO.sum_low + (CREDIT_INFO.sum_high - CREDIT_INFO.sum_low) * mult;
    currentSum = Math.trunc(sum / 10000) * 10000;  // Сумма кредита отображается кратной 10000
    document.getElementById("credit-sum-amount").innerHTML = formatModule.formatSumAmount(currentSum);
}

function initSumHints() {
    var lowerHint = document.getElementById("slider-sum-lower-bound-hint");
    var upperHint = document.getElementById("slider-sum-upper-bound-hint");
    lowerHint.innerHTML = `от ${formatModule.formatSumAmount(CREDIT_INFO.sum_low)} ₽`;
    upperHint.innerHTML = `до ${formatModule.formatSumAmount(CREDIT_INFO.sum_high)} ₽`;
}

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//                            СРОК КРЕДИТА
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function initTimeInput() {
    initTimeHints();
    initTimeSlider();
    initTimeManual();
}

export var currentTime;    // в месяцах

//------------------------------------------------------------------------
//                              ПОЛЗУНОК
//------------------------------------------------------------------------

function initTimeSlider() {
    var slider = document.getElementById("calculator-slider-time");
    updateTimeSpan();
    // Ползунок реагирует на движения только при зажатой клавише мыши
    // Это сделано для того, чтобы ввод не менялся от рандомных прохождений курсора над ползунком
    slider.addEventListener("mousedown", enableTrackTimeSlider);
    slider.addEventListener("mouseup", disableTrackTimeSlider);
    slider.addEventListener("click", () => {
        updateTimeSpan();
        updateOutput();
    });
}

function enableTrackTimeSlider(e) {
    e.target.addEventListener("mousemove", trackTimeSlider);
}

function disableTrackTimeSlider(e) {
    e.target.removeEventListener("mousemove", trackTimeSlider);
}

function trackTimeSlider() {
    updateTimeSpan();
    updateOutput();
}

//------------------------------------------------------------------------
//                             РУЧНОЙ ВВОД
//------------------------------------------------------------------------

function initTimeManual() {
    var timeSpan = document.getElementById("credit-time-amount");
    // Ручной ввод при нажатии на время
    timeSpan.addEventListener("mousedown", startManualTimeInput);
    initTimeManualFormatter();
}

function startManualTimeInput() {
    var timeSpan = document.getElementById("credit-time-amount");
    var manualTime = document.getElementById("calculator-manual-time");
    var startVal = currentTime;
    var manualTimeEnding = document.getElementById("manual-time-hint");

    timeSpan.style.display = "none";
    manualTime.style.display = "inline-block";
    manualTime.value = startVal;
    manualTimeEnding.style.display = "inline-block";
    formatModule.updateManualTimeEnding(startVal, document.getElementById("manual-time-hint"));


    // Ползунок выключен во время ручного ввода
    var slider = document.getElementById("calculator-slider-time");
    slider.disabled = "true";
    // Ручной ввод завершается при нажатии на другую часть страницы
    document.body.addEventListener("click", finishManualTimeInput);
}

function finishManualTimeInput(e) {
    var timeSpan = document.getElementById("credit-time-amount");
    var manualTime = document.getElementById("calculator-manual-time");
    var manualTimeEnding = document.getElementById("manual-time-hint");
    // Нажатия на элемент ввода игнорируются
    var manualTimeHint = document.getElementById("manual-time-hint");
    if (e.target == manualTime || e.target == manualTimeHint || Array.from(e.target.children).includes(manualTime)) {
        return;
    }
    document.body.removeEventListener("click", finishManualTimeInput);

    var months = Number(manualTime.value);
    timeSpan.style.display = "inline-block";
    manualTime.style.display = "none";
    manualTimeEnding.style.display = "none";

    if (months < CREDIT_INFO.time_low) {
        months = CREDIT_INFO.time_low;
    }
    else if (months > CREDIT_INFO.time_high*12) {
        months = CREDIT_INFO.time_high*12;
    }
    currentTime = months;
    timeSpan.innerHTML = formatModule.formatTimeAmount(months);
    updateOutput();

    // Обратно включаем ползунок и устанавливаем его положение в соответствии с новым сроком
    var slider = document.getElementById("calculator-slider-time");
    slider.removeAttribute("disabled");
    slider.value = Math.trunc(months / (CREDIT_INFO.time_high*12) * slider.max);
    slider.style.setProperty('--value', slider.value);
}

function initTimeManualFormatter() {
    var manualTime = document.getElementById("calculator-manual-time");
    manualTime.addEventListener("input", formatModule.timeManualFormatter);
}

//------------------------------------------------------------------------
//                              РАЗНОЕ
//------------------------------------------------------------------------

function initTimeHints() {
    var lowerHint = document.getElementById("slider-time-lower-bound-hint");
    var upperHint = document.getElementById("slider-time-upper-bound-hint");

    var lowerEnding = (CREDIT_INFO.time_low > 1) ? "месяцев" : "месяца";
    var upperEnding = (CREDIT_INFO.time_high > 1) ? "лет" : "года";

    lowerHint.innerHTML = `от ${CREDIT_INFO.time_low} ${lowerEnding}`;
    upperHint.innerHTML = `до ${CREDIT_INFO.time_high} ${upperEnding}`;
}

function updateTimeSpan() {
    var slider = document.getElementById("calculator-slider-time");
    var mult = slider.value / slider.max;
    var months = CREDIT_INFO.time_low + (CREDIT_INFO.time_high * 12 - CREDIT_INFO.time_low) * mult;
    months = Math.trunc(months);
    currentTime = months;
    document.getElementById("credit-time-amount").innerHTML = formatModule.formatTimeAmount(months);
}

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//                            ВЫВОД КАЛЬКУЛЯТОРА
//------------------------------------------------------------------------
//------------------------------------------------------------------------

export var currentInterest;

function updateOutput() {
    updateInterestRate();
    var monthlyPay = calculateMonthlyPay();
    var totalPay = monthlyPay * currentTime;
    var overPay = totalPay - currentSum;

    document.getElementById("credit-over-pay").innerHTML = formatModule.formatSumAmount(overPay.toFixed(2));
    document.getElementById("credit-total-pay").innerHTML = formatModule.formatSumAmount(totalPay.toFixed(2));
    document.getElementById("credit-monthly-pay").innerHTML = formatModule.formatSumAmount(monthlyPay.toFixed(2));
}

function updateInterestRate() {
    if (currentTime > 12 && currentSum > (CREDIT_INFO.sum_high * 0.15)) {
        currentInterest = CREDIT_INFO.interest_low;
    }
    else {
        currentInterest = CREDIT_INFO.interest_high;
    }

    var interestSpan = document.getElementById("credit-interest-rate");
    var displayInterest = currentInterest.toString().replace('.', ',');
    interestSpan.innerHTML = `${displayInterest} %`;
}

function calculateMonthlyPay() {
    var pct = currentInterest / 1200;
    var payCoeff = (pct * Math.pow((pct + 1), currentTime)) / (Math.pow((1 + pct), currentTime) - 1);
    return currentSum * payCoeff;
}