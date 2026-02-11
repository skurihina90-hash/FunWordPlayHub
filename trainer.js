// trainer.js

const dictionary = {
    "Еда":[
        {RU:"яблоко",EN:"apple",GE:"ვაშლი",KZ:"алма"},
        {RU:"хлеб",EN:"bread",GE:"პური",KZ:"нан"},
        {RU:"молоко",EN:"milk",GE:"რძე",KZ:"сүт"}
    ],
    "Животные":[
        {RU:"кот",EN:"cat",GE:"კატა",KZ:"мысық"},
        {RU:"собака",EN:"dog",GE:"ძაღლი",KZ:"ит"},
        {RU:"птица",EN:"bird",GE:"ჩიტი",KZ:"құс"}
    ]
};

// ===== Получаем язык для изучения из URL =====
const urlParams = new URLSearchParams(window.location.search);
const studyLang = urlParams.get("lang") || "EN"; 

// ===== Автоматический выбор родного языка =====
// Если изучаем английский, русский пользователь — RU, грузинский — GE и т.д.
const defaultNativeLang = {
    RU: "RU",
    EN: "EN",
    GE: "GE",
    KZ: "KZ"
};

let nativeLang = defaultNativeLang[studyLang] || "RU"; 
let currentTheme = "Еда";
let words = [];
let currentIndex = 0;
let score = 0;

const container = document.getElementById("trainer-container");

// ===== Создание интерфейса =====
function createTrainerUI() {
    container.innerHTML = "";

    // Выбор родного языка
    const nativeSelect = document.createElement("select");
    for (let lang of ["RU","EN","GE","KZ"]) {
        let opt = document.createElement("option");
        opt.value = lang;
        opt.textContent = lang;
        if(lang === nativeLang) opt.selected = true;
        nativeSelect.appendChild(opt);
    }
    nativeSelect.addEventListener("change", () => nativeLang = nativeSelect.value);
    container.appendChild(document.createTextNode("Ваш родной язык: "));
    container.appendChild(nativeSelect);

    container.appendChild(document.createElement("br"));

    // Выбор темы
    const themeSelect = document.createElement("select");
    for (let theme in dictionary) {
        let opt = document.createElement("option");
        opt.value = theme;
        opt.textContent = theme;
        themeSelect.appendChild(opt);
    }
    themeSelect.value = currentTheme;
    themeSelect.addEventListener("change", () => {
        currentTheme = themeSelect.value;
        startLesson();
    });
    container.appendChild(document.createTextNode("Выберите тему: "));
    container.appendChild(themeSelect);

    container.appendChild(document.createElement("br"));

    // Слово
    const wordDisplay = document.createElement("h3");
    wordDisplay.id = "wordDisplay";
    container.appendChild(wordDisplay);

    // Ввод ответа
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answerInput";
    input.placeholder = "Введите перевод";
    container.appendChild(input);

    // Кнопка проверки
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "Проверить";
    checkBtn.addEventListener("click", checkAnswer);
    container.appendChild(checkBtn);

    // Результат
    const result = document.createElement("p");
    result.id = "resultDisplay";
    container.appendChild(result);

    // Счёт
    const scoreDisplay = document.createElement("p");
    scoreDisplay.id = "scoreDisplay";
    container.appendChild(scoreDisplay);
}

// ===== Функции =====
function startLesson() {
    words = dictionary[currentTheme];
    currentIndex = 0;
    score = 0;
    showWord();
    document.getElementById("scoreDisplay").textContent = `Правильно: ${score}/${words.length}`;
    document.getElementById("resultDisplay").textContent = "";
    document.getElementById("answerInput").value = "";
}

function showWord() {
    const word = words[currentIndex];
    document.getElementById("wordDisplay").textContent = word[studyLang];
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();
}

function checkAnswer() {
    const word = words[currentIndex];
    const answer = document.getElementById("answerInput").value.trim().toLowerCase();
    if(answer === word[nativeLang].toLowerCase()){
        document.getElementById("resultDisplay").textContent = "✔ Верно!";
        score++;
    } else {
        document.getElementById("resultDisplay").textContent = `✖ Неверно! Правильный ответ: ${word[nativeLang]}`;
    }

    currentIndex++;
    if(currentIndex < words.length) {
        setTimeout(showWord, 1000);
    } else {
        setTimeout(() => {
            document.getElementById("resultDisplay").textContent = `Урок завершён! Результат: ${score}/${words.length}`;
            document.getElementById("wordDisplay").textContent = "";
        }, 1000);
    }
    document.getElementById("scoreDisplay").textContent = `Правильно: ${score}/${words.length}`;
}

document.addEventListener("DOMContentLoaded", () => {
    createTrainerUI();
    startLesson();
    document.getElementById("answerInput").addEventListener("keypress", (e) => {
        if(e.key === "Enter") checkAnswer();
    });
});
