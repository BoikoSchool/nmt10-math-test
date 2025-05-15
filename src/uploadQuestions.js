// uploadQuestions.js
import { db } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";

// Масив питань
const questions = [
  {
    id: 1,
    type: "single",
    question: "$$\\sqrt{1\\frac{9}{16}}$$",
    options: [
      { id: 1, label: "$$\\frac{3}{4}$$" },
      { id: 2, label: "$$\\frac{9}{16}$$" },
      { id: 3, label: "$$1\\frac{1}{4}$$" },
      { id: 4, label: "$$2\\frac{1}{4}$$" },
      { id: 5, label: "$$\\frac{4}{5}$$" },
    ],
    answer: "$$1\\frac{1}{4}$$",
  },
  {
    id: 2,
    type: "single",
    question: "$$\\frac{x^4 - 16}{x^4 + 8x^2 + 16}$$",
    options: [
      { id: 1, label: "$$-\\frac{1}{8x^2}$$" },
      { id: 2, label: "$$\\frac{x^2 - 4}{x^2 + 4}$$" },
      { id: 3, label: "$$\\frac{x^2 + 4}{x^2 - 4}$$" },
      { id: 4, label: "$$-\\frac{2}{x^2 + 2}$$" },
      { id: 5, label: "$$\\frac{x - 2}{x + 2}$$" },
    ],
    answer: "$$\\frac{x^2 - 4}{x^2 + 4}$$",
  },
  {
    id: 3,
    type: "single",
    question:
      "$$\\frac{3}{|x-1|} = 2$$. Якому проміжку належить найменший корінь рівняння?",
    options: [
      { id: 1, label: "$$(-\\infty;-2]$$" },
      { id: 2, label: "$$[-2;-1)$$" },
      { id: 3, label: "$$[-1;0)$$" },
      { id: 4, label: "$$[0;2)$$" },
      { id: 5, label: "$$[2;\\infty)$$" },
    ],
    answer: "$$[-1;0)$$",
  },
  {
    id: 4,
    type: "single",
    question:
      "В прямокутному трикутнику $$ABC (\\angle C = 90^\\circ)$$ проведено медіану $$CM$$. Знайдіть градусну міру $$\\angle AMC$$, якщо $$\\angle B = 32^\\circ$$.",
    image: "https://i.postimg.cc/Yqd61vPp/4.png",
    options: [
      { id: 1, label: "$$58^\\circ$$" },
      { id: 2, label: "$$60^\\circ$$" },
      { id: 3, label: "$$62^\\circ$$" },
      { id: 4, label: "$$64^\\circ$$" },
      { id: 5, label: "$$66^\\circ$$" },
    ],
    answer: "$$64^\\circ$$",
  },
  {
    id: 5,
    type: "single",
    question:
      "Знайдіть $$\\lg \\left( \\frac{a}{100} \\right)$$, якщо $$\\lg a = 5$$.",
    options: [
      { id: 1, label: "$$0.5$$" },
      { id: 2, label: "$$1$$" },
      { id: 3, label: "$$2$$" },
      { id: 4, label: "$$2.5$$" },
      { id: 5, label: "$$3$$" },
    ],
    answer: "$$3$$",
  },
  {
    id: 6,
    type: "single",
    question:
      "Відомо, що $$k$$ однакових зошитів коштують $$x$$ гривень. Скільки гривень коштують $$p$$ таких зошитів?",
    options: [
      { id: 1, label: "$$\\frac{p}{xk}$$" },
      { id: 2, label: "$$\\frac{xp}{k}$$" },
      { id: 3, label: "$$\\frac{pk}{x}$$" },
      { id: 4, label: "$$xkp$$" },
      { id: 5, label: "$$\\frac{xk}{p}$$" },
    ],
    answer: "$$\\frac{xp}{k}$$",
  },
  {
    id: 7,
    type: "single",
    question: "Укажіть функцію, графік якої зображено на рисунку.",
    image: "https://i.postimg.cc/J4r3DNP6/7.png",
    options: [
      { id: 1, label: "$$y = -(x - 1)(x + 3)$$" },
      { id: 2, label: "$$y = (x - 1)(x + 3)$$" },
      { id: 3, label: "$$y = (x + 1)(x - 3)$$" },
      { id: 4, label: "$$y = -(x + 1)(x - 3)$$" },
      { id: 5, label: "$$y = (x - 3)(x - 1)$$" },
    ],
    answer: "$$y = -(x + 1)(x - 3)$$",
  },
  {
    id: 8,
    type: "single",
    question:
      "Укажіть формулу для обчислення площі бічної поверхні $$S$$ конуса, радіус основи якого і висота дорівнюють $$R$$.",
    options: [
      { id: 1, label: "$$S = \\pi R^2$$" },
      { id: 2, label: "$$S = \\frac{\\pi R^2}{3}$$" },
      { id: 3, label: "$$S = \\frac{\\pi R^3}{3}$$" },
      { id: 4, label: "$$S = 2\\pi R^2$$" },
      { id: 5, label: "$$S = \\sqrt{2}\\pi R^2$$" },
    ],
    answer: "$$S = \\sqrt{2}\\pi R^2$$",
  },
  {
    id: 9,
    type: "single",
    question:
      "Серед учнів 11 класу провели опитування: скільки часу вони витрачають щодня на підготовку до НМТ. Результати опитування подано у вигляді діаграми, зображеної на рисунку. Укажіть середнє значення часу підготовки до іспиту серед учнів цього класу.",
    image: "https://i.postimg.cc/gjDvtjkH/9.png",
    options: [
      { id: 1, label: "1 год" },
      { id: 2, label: "1 год 24 хв" },
      { id: 3, label: "1 год 30 хв" },
      { id: 4, label: "1 год 36 хв" },
      { id: 5, label: "1 год 45 хв" },
    ],
    answer: "1 год 30 хв",
  },
  {
    id: 10,
    type: "single",
    question:
      "При якому додатному значенні змінної $$x$$ числа $$x$$, $$6$$, $$x + 5$$ будуть трьома послідовними елементами геометричної прогресії?",
    options: [
      { id: 1, label: "$$x = 1$$" },
      { id: 2, label: "$$x = 2$$" },
      { id: 3, label: "$$x = 3$$" },
      { id: 4, label: "$$x = 4$$" },
      { id: 5, label: "$$x = 5$$" },
    ],
    answer: "$$x = 4$$",
  },
  {
    id: 11,
    type: "single",
    question:
      "Які з наведених тверджень є правильними?\n\nI. Існує паралелограм, в який можна вписати коло.\nII. В будь-якому паралелограмі діагоналі рівні.\nIII. Сума квадратів діагоналей будь-якого паралелограма дорівнює сумі квадратів його сторін.",
    options: [
      { id: 1, label: "лише I" },
      { id: 2, label: "лише I та II" },
      { id: 3, label: "лише I та III" },
      { id: 4, label: "лише II та III" },
      { id: 5, label: "I, II та III" },
    ],
    answer: "лише I та III",
  },
  {
    id: 12,
    type: "single",
    question:
      "Спростіть вираз $$\\frac{\\sin 2\\alpha}{2 \\sin(180^\\circ + \\alpha)}$$",
    options: [
      { id: 1, label: "$$-\\cos \\alpha$$" },
      { id: 2, label: "$$\\cos \\alpha$$" },
      { id: 3, label: "$$\\sin \\alpha$$" },
      { id: 4, label: "$$-1$$" },
      { id: 5, label: "$$1$$" },
    ],
    answer: "$$-\\cos \\alpha$$",
  },
  {
    id: 13,
    type: "single",
    question:
      "Розв’яжіть систему нерівностей:$$\n\\begin{cases}\n\\left(\\frac{1}{2}\\right)^x > 0{,}125, \\\\\n\\log_2 x < 3\n\\end{cases}$$",
    options: [
      { id: 1, label: "$$(3; 8)$$" },
      { id: 2, label: "$$(0; 3)$$" },
      { id: 3, label: "$$(-\\infty; 3)$$" },
      { id: 4, label: "$$(0; 8)$$" },
      { id: 5, label: "$$(3; 9)$$" },
    ],
    answer: "$$(0; 3)$$",
  },
  {
    id: 14,
    type: "single",
    question:
      "На рисунку зображено графік функції $$y = f(x)$$ і дотичну до нього в точці з абсцисою $$x_0$$. Знайдіть значення $$f'(x_0)$$.",
    image: "https://i.postimg.cc/vTMrvfMm/14.png",
    options: [
      { id: 1, label: "$$-2.5$$" },
      { id: 2, label: "$$-0.6$$" },
      { id: 3, label: "$$0.6$$" },
      { id: 4, label: "$$\\frac{5}{3}$$" },
      { id: 5, label: "$$2.5$$" },
    ],
    answer: "$$-0.6$$",
  },
  {
    id: 15,
    type: "single",
    question:
      "Визначте координати вектора $$\\vec{c} = 2\\vec{a} - \\frac{1}{2}\\vec{b}$$, якщо $$\\vec{a}(-1; 3)$$, $$\\vec{b}(4; -2)$$.",
    options: [
      { id: 1, label: "$$(2; 1)$$" },
      { id: 2, label: "$$(-2; 1)$$" },
      { id: 3, label: "$$(-4; 5)$$" },
      { id: 4, label: "$$(-4; 7)$$" },
      { id: 5, label: "$$(0; 5)$$" },
    ],
    answer: "$$(-4; 7)$$",
  },
  {
    id: 16,
    type: "matching",
    question:
      "До кожного початку речення (1–3) доберіть його закінчення (А–Д) так, щоб утворилося правильне твердження, якщо $$n > 0$$.",
    pairs: {
      left: [
        "$$1.\\ \\sqrt{2} \\cdot \\sqrt{8n^2} = a$$",
        "$$2.\\ \\log_2 n + 1 = \\log_2 a$$",
        "$$3.\\ 2^n \\cdot 16 = 2^a$$",
      ],
      right: [
        "А. $$a = n + 1$$",
        "Б. $$a = n + 4$$",
        "В. $$a = 2n$$",
        "Г. $$a = 3n$$",
        "Д. $$a = 4n$$",
      ],
    },
    answer: {
      1: "Д",
      2: "В",
      3: "Б",
    },
  },
  {
    id: 17,
    type: "matching",
    question:
      "Установіть відповідність між твердженнями (1–3) та функцією (А–Д), для якої це твердження є правильним.",
    pairs: {
      left: [
        "1. Областю визначення є проміжок $$[0; \\infty)$$",
        "2. Найменше значення функції дорівнює $$-1$$",
        "3. Графік симетричний відносно осі $$y$$",
      ],
      right: [
        "А. $$y = \\sqrt{x}$$",
        "Б. $$y = x^2$$",
        "В. $$y = \\sin x$$",
        "Г. $$y = 2^x$$",
        "Д. $$y = \\log_2 x$$",
      ],
    },
    answer: {
      1: "А",
      2: "В",
      3: "Б",
    },
  },
  {
    id: 18,
    type: "matching",
    question:
      "Діагональ $$AC$$ рівнобічної трапеції $$ABCD$$ перпендикулярна до сторони $$CD$$ ($$\\angle D = 60^\\circ$$, $$CD = 8$$ см). До кожного початку речення (1–3) доберіть його закінчення (А–Д) так, щоб утворилося правильне твердження.",
    image: "https://i.postimg.cc/3R2jp9s6/18.png",
    pairs: {
      left: [
        "1. Довжина діагоналі трапеції",
        "2. Довжина висоти трапеції",
        "3. Довжина меншої основи трапеції",
      ],
      right: [
        "А. дорівнює 4 см",
        "Б. дорівнює $$4\\sqrt{3}$$ см",
        "В. дорівнює 8 см",
        "Г. дорівнює $$8\\sqrt{3}$$ см",
        "Д. дорівнює 16 см",
      ],
    },
    answer: {
      1: "Г",
      2: "Б",
      3: "В",
    },
  },
  {
    id: 19,
    type: "input",
    question:
      "Використовуючи геометричний зміст інтегралу, обчисліть\n" +
      "$$\\frac{1}{\\pi} \\int_{0}^{3} \\sqrt{9 - x^2} \\, dx.$$",
    answer: "2,25",
  },
  {
    id: 20,
    type: "input",
    question:
      "Готуючись до НМТ з математики, учню потрібно опанувати 11 тем з алгебри та 4 теми з геометрії. " +
      "Для повторення на консультацію перед іспитом вчитель запропонував обрати дві теми з алгебри і одну тему з геометрії. " +
      "Скільки всього є варіантів такого вибору?",
    answer: "220",
  },
  {
    id: 21,
    type: "input",
    question:
      "У прямокутній системі координат у просторі задано прямокутну призму $$ABCA_1B_1C_1$$, вершина основи $$A$$ якої співпадає з початком координат. " +
      "Визначте площу повної поверхні цієї призми, якщо $$B(4; 0; 0)$$, $$C(0; 3; 0)$$, $$A_1(0; 0; 5)$$.",
    answer: "72",
  },
  {
    id: 22,
    type: "input",
    question:
      "Визначте найбільше значення $$a$$, за якого система рівнянь\n" +
      "$$\\begin{cases}\n" +
      "\\sin x + \\sqrt{y} = 3 - a - \\sqrt{y}, \\\\\n" +
      "\\sin x + 3\\sqrt{y} = 4 + a - \\sin x.\n" +
      "\\end{cases}$$\n" +
      "має розв'язки.",
    answer: "0,4",
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
