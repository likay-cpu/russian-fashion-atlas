
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


const rawQuiz = [  
    {
        q: "А когда с человеком может произойти «дрожемент»?",
        explain: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».",
        answers: [
            { text: "Когда он влюбляется", correct: false },
            { text: "Когда он идет шопиться", correct: false },
            { text: "Когда он слышит смешную шутку", correct: false },
            { text: "Когда он боится, пугается", correct: true }
        ]
    },
    {
        q: "Говорят, Антон «заовнил» всех. Это ещё как понимать?",
        explain: "Термин «заовнить» заимствован из английского языка от own — «победить», «завладеть», «получить».",
        answers: [
            { text: "Как так, «заовнил»? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false },
            { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
            { text: "Молодец, Антон, всех победил!", correct: true },
            { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false }
        ]
    },
    {
        q: "А фразу «заскамить мамонта» как понимать?",
        explain: "«Заскамить мамонта» — значит обмануть или развести на деньги. Почему мамонта? Часто в жертвы выбирают пожилых (древних, как мамонты) людей.",
        answers: [
            { text: "Разозлить кого-то из родителей", correct: false },
            { text: "Увлекаться археологией", correct: false },
            { text: "Развести недотёпу на деньги", correct: true },
            { text: "Оскорбить пожилого человека", correct: false }
        ]
    },
    {
        q: "Кто такие «бефефе»?",
        explain: "«Бефефе» — это лучшие друзья. Аббревиатура от английского выражения best friends forever.",
        answers: [
            { text: "Вши?", correct: false },
            { text: "Милые котики, такие милые, что бефефе", correct: false },
            { text: "Лучшие друзья", correct: true },
            { text: "Люди, которые не держат слово", correct: false }
        ]
    }
];



var shuffledQuestions = shuffle(rawQuiz);
var quiz = [];
for (var i = 0; i < shuffledQuestions.length; i++) {
    var q = shuffledQuestions[i];
    var shuffledAnswers = shuffle(q.answers);

    quiz.push({
        q: q.q,
        explain: q.explain,
        answers: shuffledAnswers
    });
}


const quizArea = document.getElementById('quizArea');
const endBanner = document.getElementById('endBanner');
const statsEl = document.getElementById('stats');
const reviewSection = document.getElementById('review');
const reviewList = document.getElementById('reviewList');

let current = 0;  
let correctCount = 0;  
let isAnswered = false;  
const history = []; 

function svgCheck() {
    return '✓'; 
}
function svgCross() {
    return '✕'; 
}

function renderQuestion() {
    quizArea.innerHTML = '';   
    isAnswered = false;  

    if (current >= quiz.length) {
        endBanner.classList.remove('hidden');
        endBanner.classList.add('visible');
        showStats();
        buildReview();
        return;
    }

    const q = quiz[current];

    const card = document.createElement('div');  
    card.className = 'question-card'; 

    const header = document.createElement('div');
    header.className = 'q-header';  
    header.innerHTML = `
    <div class="q-num">Вопрос ${current + 1} / ${quiz.length}</div>
    <div class="q-text">${q.q}</div>
    <div class="q-marker" id="qMarker"></div>
  `;

    const answersWrap = document.createElement('div');
    answersWrap.className = 'answers';

    q.answers.forEach(function (ans, idx) {
        var btn = document.createElement('button');
        btn.className = 'answer';
        btn.type = 'button';
        btn.innerText = ans.text;

        btn.addEventListener('click', function () {
            onAnswer(btn, ans, idx, q, answersWrap, header);
        });

        answersWrap.appendChild(btn);
    });

    card.appendChild(header);
    card.appendChild(answersWrap);
    quizArea.appendChild(card);
}

function onAnswer(btn, ans, idx, q, answersWrap, header) {      
    if (isAnswered) return; 
    isAnswered = true;

    var all = answersWrap.querySelectorAll('.answer');   
    for (var i = 0; i < all.length; i++) {
        all[i].classList.add('disabled');
    }
    
    var marker = header.querySelector('#qMarker'); 

  
    var correctIdx = -1;  
    for (var i = 0; i < q.answers.length; i++) {
        if (q.answers[i].correct === true) {
            correctIdx = i;
            break;
        }
    }
    var chosenIdx = idx;

    btn.classList.add('selected');
    if (ans.correct) {
        btn.classList.add('correct');
        correctCount++;

        
        const ex = document.createElement('div');
        ex.className = 'explain';
        ex.textContent = q.explain;
        btn.appendChild(ex);
    } else {
        btn.classList.add('wrong');  
    }
    var delay = 420; 



    setTimeout(function () {
        marker.classList.add('visible');
        if (ans.correct) {
            marker.classList.add('ok');
            marker.innerHTML = svgCheck();
        } else {
            marker.classList.add('bad');
            marker.innerHTML = svgCross();
        }
        answersWrap.classList.add('fly-right'); 
        

        var transitionMs = 1800;
        setTimeout(function () {
            var answersText = q.answers[correctIdx].text;
           
            history.push({
                q: q.q,
                explain: q.explain,
                answers: answersText,
                correctIndex: correctIdx,
                chosenIndex: chosenIdx
            });

            current++;
            renderQuestion();
        }, transitionMs + 20);
    }, delay);
}

function showStats() {
    statsEl.classList.remove('hidden');
    statsEl.textContent = `Статистика правильных ответов: ${correctCount} из ${quiz.length}`;
}

function buildReview() {
    reviewSection.classList.remove('hidden');
    reviewList.innerHTML = '';

    for (var i = 0; i < history.length; i++) {
        var h = history[i];

        var li = document.createElement('li');
        li.className = 'review-item';

        var btn = document.createElement('button');
        btn.className = 'review-q';
        btn.type = 'button';
        

        var ok = (h.chosenIndex === h.correctIndex);

        var miniHTML;
        if (ok) {
            miniHTML = svgCheck();  
        } else {
            miniHTML = svgCross();  
        }

       
        btn.innerHTML =
            '<span class="q-num">' + (i + 1) + '.</span>' +
            '<span>' + h.q + '</span>' +
            '<span class="mini-marker">' + miniHTML + '</span>';

      
        var body = document.createElement('div');
        body.className = 'review-body';


        body.innerHTML =
            '<div class="correct-block">' +
        '<div class="answer-chip">Правильный ответ: <b>' + h.answers+ '</b></div>' +
            '<div class="explain">' + h.explain + '</div>' +
            '</div>';

        
        btn.addEventListener('click', function () {
           
            var b = this.nextElementSibling; 
            var opened = reviewList.querySelectorAll('.review-body.open');
            for (var k = 0; k < opened.length; k++) {  
                if (opened[k] !== b) {                      
                    opened[k].classList.remove('open');
                }
            }
            
            b.classList.toggle('open');  
        });
        li.appendChild(btn);
        li.appendChild(body);
        reviewList.appendChild(li);
        console.log(shuffledQuestions);
    }
}

renderQuestion();


























































/* // Получить только вопрос
const question = rawQuiz[0].q;
console.log(question); // "А когда с человеком может произойти «дрожемент»?"

// Получить объяснение
const explanation = rawQuiz[0].explain;
console.log(explanation); // "Лексема «дрожемент» имплицирует..."

// Получить массив ответов
const answers = rawQuiz[0].answers;
console.log(answers); // Массив из 4 объектов с ответами

// Получить текст первого ответа
const firstAnswerText = rawQuiz[0].answers[0].text;
console.log(firstAnswerText); // "Когда он влюбляется"*/


/*это свойство DOM-элемента, которое позволяет получить или установить HTML-содержимое элемента.     позволяет задавать или извлекать содержимое HTML элемента     
                                для динамического обновления содержимого веб-страниц. Чтобы не держать в DOM старые карточки и обработчики. Мы показываем ровно один экранный вопрос.*/



/*Рисует на странице один текущий вопрос (карточку с заголовком и вариантами).
Если вопросы закончились — показывает баннер, статистику и «Разбор», и прекращает работу.
Каждый вызов полностью пересоздаёт карточку (один вопрос за раз). */





// btn         — нажатая кнопка-ответ (DOM-элемент <button>)
// ans         — объект выбранного ответа { text, correct }
// idx         — индекс выбранного ответа в массиве q.answers
// q           — объект текущего вопроса { q, explain, answers[...] }
// answersWrap — контейнер с ответами (div.answers) этого вопроса
// header      — шапка вопроса (div.q-header), внутри неё есть #qMarker


/*document.createElement('div')
document - объект, представляющий всю HTML-страницу

.createElement() - метод для создания нового элемента

'div' - тип создаваемого элемента (блочный контейнер) */




/*Блокируем кнопки

Проверяем правильность

Показываем результат (через 1.4с)

Анимируем уход (через 0.42с)

Сохраняем и переходим дальше */




