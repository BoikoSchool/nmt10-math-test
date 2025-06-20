// uploadQuestions.js
import { db } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";

// Масив питань
const questions10 = [
  {
    id: 1,
    type: "single",
    question: "$$\\left( \\frac{5}{2} \\right)^2$$",
    options: [
      { id: 1, label: "3,5" },
      { id: 2, label: "6,25" },
      { id: 3, label: "4,5" },
      { id: 4, label: "5" },
      { id: 5, label: "12,5" },
    ],
    answer: "6,25",
  },
  {
    id: 2,
    type: "single",
    question:
      "До кола з центром у точці $$O$$ проведено дотичну $$AK,$$ $$A$$ — точка дотику (див. рисунок). На $$AK$$ вибрано точку $$B$$ так, що $$\\angle AOB = 55^\\circ$$. Знайдіть градусну міру кута $$OBK$$",
    image: "https://i.postimg.cc/90PX8Sb6/2025-05-29-15-47-42.png",
    options: [
      { id: 1, label: "$$145^\\circ$$" },
      { id: 2, label: "$$55^\\circ$$" },
      { id: 3, label: "$$135^\\circ$$" },
      { id: 4, label: "$$155^\\circ$$" },
      { id: 5, label: "$$125^\\circ$$" },
    ],
    answer: "$$145^\\circ$$",
  },
  {
    id: 3,
    type: "single",
    question: "Розв'яжіть рівняння $$\\frac{3x}{x-2} = 0$$.",
    options: [
      { id: 1, label: "3" },
      { id: 2, label: "2" },
      { id: 3, label: "-3" },
      { id: 4, label: "0" },
      { id: 5, label: "-2" },
    ],
    answer: "0",
  },
  {
    id: 4,
    type: "single",
    question:
      "На рисунку зображено графік функції $$y = f(x),$$ визначеної на проміжку [-2; 4]. Вкажіть точку перетину графіка функції $$y = f(x + 1)$$ з віссю $$y$$",
    image: "https://i.postimg.cc/nrm26KQb/2025-05-29-15-54-07.png",
    options: [
      { id: 1, label: "(1; 0)" },
      { id: 2, label: "(3; 0)" },
      { id: 3, label: "(0; -3)" },
      { id: 4, label: "(0; -4)" },
      { id: 5, label: "(0; -1)" },
    ],
    answer: "(0; -1)",
  },
  {
    id: 5,
    type: "single",
    question:
      "У магазині одяг всі футболки коштують 300 грн. У магазині діє акція: отримай знижку на одиницю другого товару. Скільки гривень має заплатити покупець за дві такі футболки разом, якщо за умовами акції за другу футболку він має заплатити на 40% менше?",
    options: [
      { id: 1, label: "180 грн" },
      { id: 2, label: "450 грн" },
      { id: 3, label: "420 грн" },
      { id: 4, label: "120 грн" },
      { id: 5, label: "480 грн" },
    ],
    answer: "480 грн",
  },
  {
    id: 6,
    type: "single",
    question:
      "Які з наведених тверджень є правильними?\n\nI. Існує ромб, діагональ якого дорівнює сумі двох протилежних сторін.\n\nII. Існує ромб, сума протилежних кутів якого дорівнює $$20^\\circ$$.\n\nIII. Існує ромб, діагональ якого ділить його на два правильні трикутники.",
    options: [
      { id: 1, label: "лише II" },
      { id: 2, label: "лише I та II" },
      { id: 3, label: "лише III" },
      { id: 4, label: "лише II та III" },
      { id: 5, label: "I, II та III" },
    ],
    answer: "лише II та III",
  },
  {
    id: 7,
    type: "single",
    question: "Розкласть на множники $$x^2 - 6x + 5$$",
    options: [
      { id: 1, label: "(x + 1)(x - 5)" },
      { id: 2, label: "(x - 2)(x - 3)" },
      { id: 3, label: "(x + 1)(x + 5)" },
      { id: 4, label: "(x - 1)(x - 5)" },
      { id: 5, label: "(x + 2)(x + 3)" },
    ],
    answer: "(x - 1)(x - 5)",
  },
  {
    id: 8,
    type: "single",
    question:
      "Укажіть проміжок, якому належить корінь рівняння $$5^{3x} \\cdot 5^{-2x} = \\frac{1}{5}$$.",
    options: [
      { id: 1, label: "$$(-\\infty; -1]$$" },
      { id: 2, label: "$$(-1; -0,5]$$" },
      { id: 3, label: "$$(-0,5; 0]$$" },
      { id: 4, label: "$$(0; 0,5]$$" },
      { id: 5, label: "$$(0,5; +\\infty)$$" },
    ],
    answer: "$$(-\\infty; -1]$$",
  },
  {
    id: 9,
    type: "single",
    question:
      "Укажіть проміжок, якому належить значення виразу $$\\sqrt{5} \\cdot \\sqrt{6}$$.",
    options: [
      { id: 1, label: "(0; 2]" },
      { id: 2, label: "(2; 4]" },
      { id: 3, label: "(4; 6]" },
      { id: 4, label: "(6; 8]" },
      { id: 5, label: "(8; 10]" },
    ],
    answer: "$$(4; 6]$$",
  },
  {
    id: 10,
    type: "single",
    question:
      "У паралелограмі $$ABCD$$ бісектриса кута $$A$$ перетинає сторону $$BC$$ в точці $$K$$ так, що $$BK : KC = 4 : 3$$ (див. рисунок). $$AK = b,$$ $$\\angle KAD = \\alpha.$$ Знайдіть периметр цього паралелограма.",
    image: "https://i.postimg.cc/Qd1k2FcM/2025-05-30-00-56-36.png",
    options: [
      { id: 1, label: "$$\\frac{4b}{11 \\cos \\alpha}$$" },
      { id: 2, label: "$$\\frac{11b}{4 \\tan \\alpha}$$" },
      { id: 3, label: "$$\\frac{11b}{4 \\cos \\alpha}$$" },
      { id: 4, label: "$$\\frac{36b}{\\cos \\alpha}$$" },
      { id: 5, label: "$$\\frac{11b}{4 \\sin \\alpha}$$" },
    ],
    answer: "$$\\frac{11b}{4 \\cos \\alpha}$$",
  },
  {
    id: 11,
    type: "single",
    question:
      "Розв'яжіть систему нерівностей: $$\\begin{cases} x^2 + 4 \\geq 0 \\\\ 2(3x - 5) - 6 < x + 8 \\end{cases}$$",
    options: [
      { id: 1, label: "$$(-\\infty; -2] \\cup [2; 4,8)$$" },
      { id: 2, label: "$$(-\\infty; 4,8)$$" },
      { id: 3, label: "$$(-\\infty; 2]$$" },
      { id: 4, label: "$$[2; 4,8)$$" },
      { id: 5, label: "$$(-\\infty; -2]$$" },
    ],
    answer: "$$(-\\infty; 4,8)$$",
  },
  {
    id: 12,
    type: "single",
    question:
      "У геометричній прогресії $$(b_n)$$ відомо, що $$b_3 = 24$$, $$b_4 = 12$$. Визначте перший член $$b_1$$ цієї прогресії.",
    options: [
      { id: 1, label: "36" },
      { id: 2, label: "48" },
      { id: 3, label: "72" },
      { id: 4, label: "96" },
      { id: 5, label: "192" },
    ],
    answer: "$$96$$",
  },
  {
    id: 13,
    type: "single",
    question:
      "У просторі задано пряму $$a$$ і точку $$M$$, яка не належить цій прямій. Скільки всього прямих, що перетинають пряму $$a$$, можна провести перпендикулярно до неї через точку $$M$$?",
    options: [
      { id: 1, label: "жодної" },
      { id: 2, label: "одну" },
      { id: 3, label: "дві" },
      { id: 4, label: "три" },
      { id: 5, label: "безліч" },
    ],
    answer: "одну",
  },
  {
    id: 14,
    type: "single",
    question:
      "Подайте вираз $$\\frac{a}{\\sqrt[7]{a}}$$ у вигляді степеня з основою $$a$$",
    options: [
      { id: 1, label: "$$-\\frac{1}{a^{\\frac{1}{7}}}$$" },
      { id: 2, label: "$$a^{-6}$$" },
      { id: 3, label: "$$a^{\\frac{1}{7}}$$" },
      { id: 4, label: "$$a^{7}$$" },
      { id: 5, label: "$$\\frac{6}{a^{\\frac{7}{6}}}$$" },
    ],
    answer: "$$a^{\\frac{6}{7}}$$",
  },
  {
    id: 15,
    type: "single",
    question:
      "На рисунку зображено куб $$ABCD A_1 B_1 C_1 D_1,$$ ребро якого дорівнює 1 см. Обчисліть відстань від точки $$A$$ до прямої $$B_1C_1$$",
    image: "https://i.postimg.cc/1t9knhyp/2025-05-30-01-10-05.png",
    options: [
      { id: 1, label: "$$1 \\text{ см}$$" },
      { id: 2, label: "$$2 \\text{ см}$$" },
      { id: 3, label: "$$\\sqrt{2} \\text{ см}$$" },
      { id: 4, label: "$$3 \\text{ см}$$" },
      { id: 5, label: "$$1,5 \\text{ см}$$" },
    ],
    answer: "$$\\sqrt{2} \\text{ см}$$",
  },
  {
    id: 16,
    type: "matching",
    question:
      "Узгодьте вираз (1–3) з точкою (А – Д) на координатній прямій, координатою якої є значення виразу.",
    image: "https://i.postimg.cc/gks5LBxp/2025-05-30-01-39-47.png",
    pairs: {
      left: [
        "1. $$2\\pi \\cdot \\pi^{-1}$$",
        "2. $$\\operatorname{tg} \\frac{5\\pi}{4}$$",
        "3. $$\\log_{\\pi} \\frac{1}{\\pi^2}$$",
      ],
      right: ["А. $$K$$", "Б. $$L$$", "В. $$M$$", "Г. $$N$$", "Д. $$P$$"],
    },
    answer: {
      1: "Д",
      2: "Г",
      3: "А",
    },
  },
  {
    id: 17,
    type: "matching",
    question:
      "У прямокутній системі координат на площині зображено ламану $ABC$, де $A(-2; 0)$, $B(0; 1)$, $C(2; 1)$ (див. рисунок). Установіть відповідність між функцією (1–3) та кількістю спільних точок її графіка з ламаною $ABC$.",
    image: "https://i.postimg.cc/bwd6DYX0/2025-05-30-01-45-18.png",
    pairs: {
      left: [
        "1. $$y = 2 - x^2$$",
        "2. $$y = \\sin x$$",
        "3. $$y = \\log_5 x$$",
      ],
      right: ["А. жодної", "Б. одна", "В. дві", "Г. три", "Д. більше трьох"],
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
      "На паралельних прямих $m$ та $n$ побудовано прямокутник $ABCD$, прямокутну трапецію $DKLM$ і прямокутний трикутник $MQP$ (див. рисунок). Користуючись даними на рисунку, узгодьте фігуру (1–3) з її площею (А – Д).",
    image: "https://i.postimg.cc/MKgB5zMm/2025-05-30-01-50-15.png",
    pairs: {
      left: [
        "1. Прямокутник $$ABCD$$",
        "2. Трапеція $$DKLM$$",
        "3. Трикутник $$MQP$$",
      ],
      right: ["А. 12", "Б. 18", "В. 21", "Г. 24", "Д. 36"],
    },
    answer: {
      1: "Г",
      2: "В",
      3: "Б",
    },
  },
  {
    id: 18,
    type: "matching",
    question:
      "На паралельних прямих $$m$$ та $$n$$ побудовано прямокутник $$ABCD$$, прямокутну трапецію $$DKLM$$ і прямокутний трикутник $$MQP$$ (див. рисунок). Користуючись даними на рисунку, узгодьте фігуру (1–3) з її площею (А – Д).",
    image: "https://i.postimg.cc/MKgB5zMm/2025-05-30-01-50-15.png",
    pairs: {
      left: [
        "1. Прямокутник $$ABCD$$",
        "2. Трапеція $$DKLM$$",
        "3. Трикутник $$MQP$$",
      ],
      right: ["А. 12", "Б. 18", "В. 21", "Г. 24", "Д. 36"],
    },
    answer: {
      1: "Г",
      2: "В",
      3: "Б",
    },
  },
  {
    id: 19,
    type: "input",
    question:
      "Знайдіть значення виразу $$|y - 2x|$$, якщо $$4x^2 - 4xy + y^2 = \\frac{9}{4}$$.",
    answer: "1,5",
  },
  {
    id: 20,
    type: "input",
    question:
      "Олена планує придбати горіхи в кіоску. Їй потрібно придбати 500 г фундука, 300 г кешью та 200 г волоських горіхів. Користуючись даними в таблиці, знайдіть середню вартість (у грн) за 100 г придбаних Оленою горіхів.\n\nТаблиця:\n| Найменування товару | Ціна |\n|---------------------|------|\n| Фундук             | 250 грн/кг |\n| Кешью              | 400 грн/кг |\n| Волоський горіх     | 150 грн/кг |",
    image: "https://i.postimg.cc/KjRNKQwG/2025-05-30-02-13-23.png",
    answer: "27,5",
  },
  {
    id: 21,
    type: "input",
    question:
      "У прямокутній системі координат на площині задано колінеарні вектори $$\\overrightarrow{AB}$$ та $$\\vec{a}(3; -5)$$. Визначте абсцису точки $$B$$, якщо $$A(-4; 1)$$, а точка $$B$$ лежить на прямій $$y = 3$$.",
    answer: "-5,2",
  },
  {
    id: 22,
    type: "input",
    question:
      "Визначте суму цілих значень $$a$$, за яких корені $$x_1$$ та $$x_2$$ квадратного рівняння\n$$x^2 - 4ax + 4a^2 - 25 = 0$$\nзадовольняють умову $$x_1 < 1 < x_2$$.",
    answer: "2",
  },
];

export const uploadQuestions10 = async () => {
  const questionsRef = collection(db, "questions10");

  // Завантажуємо кожне питання в Firebase
  for (let question of questions10) {
    await setDoc(doc(questionsRef, question.id.toString()), question);
  }

  console.log("Усі питання завантажено до Firestore ✅");
};
