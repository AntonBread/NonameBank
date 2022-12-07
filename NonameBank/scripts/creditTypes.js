// Проценты для разных кредитов
const INTEREST_PHYS_GENERAL_HIGH = 14.9;
const INTEREST_PHYS_GENERAL_LOW = 8.9;

const INTEREST_PHYS_IP_HIGH = 15.5;
const INTEREST_PHYS_IP_LOW = 11;

const INTEREST_PHYS_MORTGAGE = 7.4;

const INTEREST_JUR_SMALL_HIGH = 11.6;
const INTEREST_JUR_SMALL_LOW = 5.7;

const INTEREST_JUR_BIG_HIGH = 13.6;
const INTEREST_JUR_BIG_LOW = 9.9;

// Границы суммы для кредитов
const SUM_LOWER_PHYS_GENERAL = 50000;
const SUM_UPPER_PHYS_GENERAL = 10000000;

const SUM_LOWER_PHYS_IP = 100000;
const SUM_UPPER_PHYS_IP = 30000000;

const SUM_LOWER_PHYS_MORTGAGE = 300000;
const SUM_UPPER_PHYS_MORTGAGE = 100000000;

const SUM_LOWER_JUR_SMALL = 100000;
const SUM_UPPER_JUR_SMALL = 50000000;

const SUM_LOWER_JUR_BIG = 1000000;
const SUM_UPPER_JUR_BIG = 500000000;

// Границы срока для кредитов
// Нижняя – по месяцам
// Верхняя – по годам
const TIME_LOWER_PHYS_GENERAL = 3;
const TIME_UPPER_PHYS_GENERAL = 5;

const TIME_LOWER_PHYS_IP = 3;
const TIME_UPPER_PHYS_IP = 10;

const TIME_LOWER_PHYS_MORTGAGE = 12;
const TIME_UPPER_PHYS_MORTGAGE = 30;

const TIME_LOWER_JUR_SMALL = 6;
const TIME_UPPER_JUR_SMALL = 10;

const TIME_LOWER_JUR_BIG = 3;
const TIME_UPPER_JUR_BIG = 15;

// Массив с типами кредитов
export var creditTypesInfo = [{
    type: "phys",
    subtype: "general",
    name: "Потребительский",
    interest_high: INTEREST_PHYS_GENERAL_HIGH,
    interest_low: INTEREST_PHYS_GENERAL_LOW,
    sum_low: SUM_LOWER_PHYS_GENERAL,
    sum_high: SUM_UPPER_PHYS_GENERAL,
    time_low: TIME_LOWER_PHYS_GENERAL,
    time_high: TIME_UPPER_PHYS_GENERAL
},

{
    type: "phys",
    subtype: "ip",
    name: "ИП",
    interest_high: INTEREST_PHYS_IP_HIGH,
    interest_low: INTEREST_PHYS_IP_LOW,
    sum_low: SUM_LOWER_PHYS_IP,
    sum_high: SUM_UPPER_PHYS_IP,
    time_low: TIME_LOWER_PHYS_IP,
    time_high: TIME_UPPER_PHYS_IP
},

{
    type: "phys",
    subtype: "mortgage",
    name: "Ипотека",
    interest_high: INTEREST_PHYS_MORTGAGE,
    interest_low: INTEREST_PHYS_MORTGAGE,
    sum_low: SUM_LOWER_PHYS_MORTGAGE,
    sum_high: SUM_UPPER_PHYS_MORTGAGE,
    time_low: TIME_LOWER_PHYS_MORTGAGE,
    time_high: TIME_UPPER_PHYS_MORTGAGE
},

{
    type: "jur",
    subtype: "biz_small",
    name: "Малый бизнес",
    interest_high: INTEREST_JUR_SMALL_HIGH,
    interest_low: INTEREST_JUR_SMALL_LOW,
    sum_low: SUM_LOWER_JUR_SMALL,
    sum_high: SUM_UPPER_JUR_SMALL,
    time_low: TIME_LOWER_JUR_SMALL,
    time_high: TIME_UPPER_JUR_SMALL
},

{
    type: "jur",
    subtype: "biz_big",
    name: "Крупный бизнес",
    interest_high: INTEREST_JUR_BIG_HIGH,
    interest_low: INTEREST_JUR_BIG_LOW,
    sum_low: SUM_LOWER_JUR_BIG,
    sum_high: SUM_UPPER_JUR_BIG,
    time_low: TIME_LOWER_JUR_BIG,
    time_high: TIME_UPPER_JUR_BIG
}]