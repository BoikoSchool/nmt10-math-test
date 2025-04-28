// uploadQuestions.js
import { db } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";

// Масив питань
const questions = [
  {
    id: 1,
    type: "single",
    question: "Укажіть проміжок, якому належить √3 × √7.",
    options: [
      { id: 1, label: "[0; 2]" },
      { id: 2, label: "(2; 4]" },
      { id: 3, label: "(4; 6]" },
      { id: 4, label: "(6; 8]" },
      { id: 5, label: "(8; 10)" },
    ],
    answer: 3, // правильний варіант з id
  },
  {
    id: 2,
    type: "single",
    question: "Скільки міліметрів міститься в одному кілометрі?",
    options: [
      { id: 1, label: "10³" },
      { id: 2, label: "10⁴" },
      { id: 3, label: "10⁵" },
      { id: 4, label: "10⁶" },
      { id: 5, label: "10⁷" },
    ],
    answer: 4,
  },
  {
    id: 3,
    type: "single",
    question:
      "До кола із центром у точці O проведено дотичну AB, яка дотикається кола в точці A. Пряма OB перетинає коло в точці K так, що ∠AKO = 50°. Знайдіть градусну міру кута ABK.",
    image: "https://i.postimg.cc/KvkrLMLp/2025-04-23-14-23-15-1.png",
    options: [
      { id: 1, label: "10°" },
      { id: 2, label: "30°" },
      { id: 3, label: "40°" },
      { id: 4, label: "50°" },
      { id: 5, label: "80°" },
    ],
    answer: 2,
  },
  {
    id: 4,
    type: "single",
    question: "Розкладіть вираз 2x³ − 3x² + x на множники.",
    options: [
      { id: 1, label: "x(x−0.5)(x−1)" },
      { id: 2, label: "2x(x−0.5)(x−1)" },
      { id: 3, label: "2x·(1−x)·(1−x)" },
      { id: 4, label: "2x(x+0.5)(x+1)" },
      { id: 5, label: "x(x−0.5)(x+1)" },
    ],
    answer: 5,
  },
  {
    id: 5,
    type: "single",
    question:
      "Вершина правильної чотирикутної піраміди віддалена від площини основи на 12 см. Знайдіть площу бічної поверхні цієї піраміди, якщо в її основі лежить квадрат з периметром 40 см.",
    options: [
      { id: 1, label: "120 см²" },
      { id: 2, label: "130 см²" },
      { id: 3, label: "260 см²" },
      { id: 4, label: "300 см²" },
      { id: 5, label: "780 см²" },
    ],
    answer: 3,
  },
  {
    id: 6,
    type: "single",
    question: "Розв’яжіть нерівність (2−x)(x+2) > 5 − x(x+1).",
    options: [
      { id: 1, label: "(−∞;1)" },
      { id: 2, label: "(1;∞)" },
      { id: 3, label: "(-3;3)" },
      { id: 4, label: "(−∞;4)" },
      { id: 5, label: "4;∞)" },
    ],
    answer: 2,
  },
  {
    id: 7,
    type: "single",
    question:
      "Знайдіть значення виразу $$\\frac{\\sin(630^\\circ - \\alpha)}{\\sin \\alpha}$$",
    options: [
      { id: 1, label: "-1" },
      { id: 2, label: "1" },
      { id: 3, label: "tg α" },
      { id: 4, label: "1 / tg α" },
      { id: 5, label: "− 1/ tg α" },
    ],
    answer: 2,
  },
  {
    id: 8,
    type: "single",
    question:
      "Є прямокутний трикутник ABC. Які з наведених тверджень є правильними? \n I. ∠A+∠B = 90° \n II. AC + BC = AB \n III. AC < AB",
    image: "https://i.postimg.cc/zGwhSSf7/2025-04-23-14-28-43.png",
    options: [
      { id: 1, label: "лише I" },
      { id: 2, label: "лише III" },
      { id: 3, label: "лише I та II" },
      { id: 4, label: "лише I та III" },
      { id: 5, label: "I, II та III" },
    ],
    answer: 4,
  },
  {
    id: 9,
    type: "single",
    question:
      "Укажіть проміжок, якому належить менший корінь рівняння $$2^{|\\sqrt{x} - 5|} = 16$$",
    options: [
      { id: 1, label: "(−∞; −4)" },
      { id: 2, label: "[−4; 1)" },
      { id: 3, label: "[1; 2)" },
      { id: 4, label: "[2; 4)" },
      { id: 5, label: "[4; ∞)" },
    ],
    answer: 5,
  },
  {
    id: 10,
    type: "single",
    question:
      "Кілограм печива коштує k грн, а кілограм цукерок на 15% дорожчий за кілограм печива. Укажіть формулу для обчислення вартості P (у грн) трьох кілограмів печива та двох кілограмів цукерок.",
    options: [
      { id: 1, label: "P = 3k + 30" },
      { id: 2, label: "P = 4.7k" },
      { id: 3, label: "P = 5k + 30" },
      { id: 4, label: "P = 5k" },
      { id: 5, label: "P = 5.3k" },
    ],
    answer: 4,
  },
  {
    id: 11,
    type: "single",
    question:
      "Обчисліть $$\\lg\\left(\\frac{100}{a}\\right),$$ якщо $$\\lg a = 0{,}1$$",
    options: [
      { id: 1, label: "1" },
      { id: 2, label: "1.9" },
      { id: 3, label: "2.1" },
      { id: 4, label: "3" },
      { id: 5, label: "20" },
    ],
    answer: 2,
  },
  {
    id: 12,
    type: "single",
    question:
      "Сторона квадрата ABCD дорівнює 2. Точка K лежить на стороні AB. Визначте площу чотирикутника AKCD, якщо $$\\angle BCK = \\alpha$$",
    image: "https://i.postimg.cc/HnjnqbHq/2025-04-23-14-17-27.png",
    options: [
      { id: 1, label: "8tg α" },
      { id: 2, label: "4 - 2tg α" },
      { id: 3, label: "8 - 4tg α" },
      { id: 4, label: "2tg α" },
      { id: 5, label: "4" },
    ],
    answer: 2,
  },
  {
    id: 13,
    type: "single",
    question:
      "Укажіть рисунок, на якому може бути зображений графік похідної функції f(x) = x² + 1.",
    options: [
      { id: 1, image: "https://i.postimg.cc/nLZtksMM/a.png" },
      { id: 2, image: "https://i.postimg.cc/pVcTVtLy/image.png" },
      { id: 3, image: "https://i.postimg.cc/ZK9qCDWH/image.png" },
      { id: 4, image: "https://i.postimg.cc/3xmJZ4CD/image.png" },
      { id: 5, image: "https://i.postimg.cc/6QhWDkPW/image.png" },
    ],
    answer: 3,
  },
  {
    id: 14,
    type: "single",
    question:
      "Як зміниться об’єм конуса, якщо його висоту зменшити вдвічі, а радіус збільшити у два рази?",
    options: [
      { id: 1, label: "не зміниться" },
      { id: 2, label: "збільшиться у 2 рази" },
      { id: 3, label: "зменшиться у 2 рази" },
      { id: 4, label: "збільшиться у 4 рази" },
      { id: 5, label: "зменшиться у 4 рази" },
    ],
    answer: 2,
  },
  {
    id: 15,
    type: "single",
    question:
      "В арифметичній прогресії (aₙ) відомо, що a₄ − a₁ = −21. Знайдіть a₃ − a₅.",
    options: [
      { id: 1, label: "-7" },
      { id: 2, label: "7" },
      { id: 3, label: "-14" },
      { id: 4, label: "14" },
      { id: 5, label: "-21" },
    ],
    answer: 4,
  },
  {
    id: 16,
    type: "matching",
    question:
      "Установіть відповідність між виразом (1–3) та множиною (А–Д), до якої належить його значення, якщо a = 5.",
    pairs: {
      left: ["1. $$a^{-2}$$", "2. $$2^a$$", "3. $$|\\pi - a|$$"],
      right: [
        "А. простих чисел",
        "Б. натуральних чисел",
        "В. від’ємних чисел",
        "Г. дробових раціональних чисел",
        "Д. ірраціональних чисел",
      ],
    },
    answer: {
      1: "Г",
      2: "Б",
      3: "Д",
    },
  },
  {
    id: 17,
    type: "matching",
    question:
      "На рисунку зображено графік функції y = f(x), визначеної на проміжку [-3; 5]. Установіть відповідність між початком речення (1–3) та його закінченням (А–Д) так, щоб утворилося правильне твердження.",
    image: "https://i.postimg.cc/QdsMk2w9/2025-04-23-14-56-51.png",
    pairs: {
      left: [
        "1. Найбільше значення функції y = f(x)",
        "2. Нуль функції y = f(x - 3)",
        "3. Точка мінімуму функції y = f(x) + 2",
      ],
      right: [
        "А. дорівнює 5",
        "Б. дорівнює 4",
        "В. дорівнює 3",
        "Г. дорівнює 2",
        "Д. дорівнює 1",
      ],
    },
    answer: {
      1: "В",
      2: "Б",
      3: "А",
    },
  },
  {
    id: 18,
    type: "matching",
    question:
      "У рівносторонньому трикутнику ABC проведено висоту BK і медіану AM, які перетинаються в точці O (див. рисунок). Установіть відповідність між відрізком (1–3) та його довжиною (А–Д), якщо периметр трикутника дорівнює 36 см.",
    image: "https://i.postimg.cc/8ztTdjL9/2025-04-23-14-59-48.png",
    pairs: {
      left: [
        "1. Медіана AM",
        "2. Радіус кола, вписаного в △ABC",
        "3. Відстань від точки K до сторони AB",
      ],
      right: ["А. √3 см", "Б. 2√3 см", "В. 3√3 см", "Г. 5√3 см", "Д. 6√3 см"],
    },
    answer: {
      1: "Г",
      2: "Б",
      3: "А",
    },
  },
  {
    id: 19,
    type: "input",
    question:
      "Визначте для функції f(x)=2x + 3 первісну F(x), графік якої проходить через точку (1;2). У відповідь запишіть значення F(4)",
    answer: "26",
  },
  {
    id: 20,
    type: "input",
    question:
      "У прямокутній системі координат у просторі задано куб ABCDA₁B₁C₁D₁ з вершиною C(−2; 3; 1). Діагоналі грані AA₁B₁B перетинаються в точці K(2;1;-3). Обчисліть площу повної поверхні куба ABCDA₁B₁C₁D₁",
    answer: "108",
  },
  {
    id: 21,
    type: "input",
    question:
      "Чоловік замовив 60 жовтих тюльпанів по 50 грн за штуку і декілька тюльпанів синього кольору вартістю 60 грн за одиницю. Середня ціна однієї квітки цього замовлення склала 52 грн. Під час доставки букету один тюльпан було випадково пошкоджено. Яка ймовірність того, що він жовтий?",
    answer: "80%",
  },
  {
    id: 22,
    type: "input",
    question: `При якому найменшому додатному значенні $$a$$ система рівнянь

$$
\\left\\{
\\begin{aligned}
\\sin\\left(\\frac{\\pi y}{2}\\right) &= 1 + \\sqrt{x^2 + 6x + 9} \\\\
\\cos\\left(\\frac{2\\pi x}{3}\\right) &= y^2 + (1 - a)y + 2a - 5
\\end{aligned}
\\right.
$$

має розв’язки?`,
    answer: "3",
  },
];

export const uploadQuestions = async () => {
  const questionsRef = collection(db, "questions");

  // Завантажуємо кожне питання в Firebase
  for (let question of questions) {
    await setDoc(doc(questionsRef, question.id.toString()), question);
  }

  console.log("Усі питання завантажено до Firestore ✅");
};
