

//בעת טעינת העמוד
document.addEventListener('DOMContentLoaded', function () {

    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerNameInput = document.getElementById('player-name');
    const difficultySelect = document.getElementById('difficulty');
    const contentSelect = document.getElementById('content-world');
    const startButton = document.getElementById('start-button');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');

    const validDifficulties = ['easy', 'medium', 'hard'];

    
    //keydown
    playerNameInput.addEventListener('keydown', function (event) {
        if (event.key.match(/[a-zא-ת]/i)) {
        } else {
            alert('Please enter only letters');
            event.preventDefault();
        }
    });

    let timer;
    let timeLeft;
//-----------------
    let playerName;
//__________________
    startButton.addEventListener('click', function () {
        //trim
         playerName = playerNameInput.value.trim();
        const selectedDifficulty = difficultySelect.value;

        if (playerName === '') {
            alert('Please enter your name before starting the game.');
            return;
        }

        //includes
        if (!validDifficulties.includes(selectedDifficulty)) {
            alert('Please select a valid difficulty level.');
            return;
        }
        
//--------------------------------------------------------------------
//localstorage פונקציה ששומרת את שם המשתמש ב
function savePlayerName(playerName) {
    // קבלת רשימת השמות הנוכחית מ-localStorage  או יצירת מערך חדש
    let existingPlayerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    // בדיקה אם השם כבר קיים ברשימה
    if (!existingPlayerNames.includes(playerName)) {
      // הוספת השם לרשימה אם הוא אינו קיים
      existingPlayerNames.push(playerName);
      //מיון
      existingPlayerNames.sort();
      // שמירת הרשימה המעודכנת ב-localStorage
      localStorage.setItem('playerNames', JSON.stringify(existingPlayerNames));
      console.log(`Player name ${playerName} saved.`);
    } 
    else {
        console.log(`Player name ${playerName} already exists.`);        }
    }

  savePlayerName(playerName) 
//_____________________________________________________________________
        // הודעת שלום לשחקן
        const greeting = document.createElement('h1');
        greeting.textContent = '!' + 'שלום לך ' + playerName;
        greeting.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        greeting.style.fontSize = '45px';
        greeting.style.color = 'rgba(202, 43, 168, 0.815)';
        greeting.style.textAlign = 'center';
        greeting.style.position = 'absolute';
        greeting.style.top = '-18%';
        greeting.style.left = '50%';
        greeting.style.transform = 'translate(-50%, -50%)';

        board.appendChild(greeting);

        // הצגת מסך המשחק
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        // אתחול המשחק
        initializeGame();
    });

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft <= 0) {
                stopTimer();
                handleGameEnd(false); // הזמן נגמר, הפסד
            }
        }, 1000);
    }

    function initializeGame() {
        stopTimer(); // עצירת הטיימר אם הוא פעיל
        timeLeft = 180; // זמן התחלתי של 3 דקות (180 שניות)
        scores = 0;
        openedCards = [];
        scoreDisplay.textContent = `0`;
        timerDisplay.textContent = `03:00`;
        startTimer();

        const shuffledCards = shuffleCards(createCards());
        //forEach
        shuffledCards.forEach((cardData, index) => {
            const newCard = createCardElement(cardData, index);
            board.appendChild(newCard);
        });
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null; // לוודא שהטיימר לא ימשיך לפעול
    }

    function endGame(message) {
        const endGameScreen = document.getElementById('end-game');
        const endGameMessage = endGameScreen.querySelector('h1');//querySelector - יש עוד. לא סימנתי הכל
        endGameMessage.textContent = message;
        endGameScreen.classList.remove('hidden');
        setTimeout(() => {
            endGameScreen.style.opacity = 1;
        }, 10);
    }

    // נושא נוסף שלא למדנו - שימוש בספריה חיצונית ליצירת קונפטי
    function startConfetti() {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 40, spread: 360, ticks: 120, zIndex: 0, scale: 1.2 };//Spread

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 150 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 2500);
    }

    function addGlobalClickListener() {
        document.addEventListener('click', () => {
            location.reload();//location
        }, { once: true });
    }

    function disableCards() {
        const cards = document.querySelectorAll('.card');//querySelectorAll
        cards.forEach(card => {//forEach
            card.classList.add('disabled');
        });
    }

    function handleGameEnd(isVictory) {
            //-----------------------
            const finalTime = timerDisplay.textContent;
            savePlayerRecord(playerName, finalTime); // שומר את השיא של השחקן
            //_______________________
        if (!isVictory) {

            endGame('Game Over');
            addGlobalClickListener();
            disableCards();
        } else {

            endGame('WOW');
            startConfetti();
            const { textContent: finalTime } = timerDisplay; // Destructuring 
            stopTimer();
            timerDisplay.textContent = finalTime;
            setTimeout(() => {
                addGlobalClickListener();
            }, 0);
        }
    }


    //-------------------------------------------
    //שמירת השיא של המשתמש
    function savePlayerRecord(playerName, bestTime) {
        // קבלת רשימת השיאים הקיימים מ-localStorage או יצירת מערך חדש
        let playerRecords = JSON.parse(localStorage.getItem('playerRecords')) || [];
      
        // מציאת השיא הקיים של השחקן (אם קיים)
        const existingRecord = playerRecords.find(record => record.playerName === playerName);
      
        // אם אין שיא קיים, יוצרים שיא חדש
        if (!existingRecord) {
          playerRecords.push({ playerName, bestTime });
        } else {
          // עדכון השיא אם הזמן החדש טוב יותר
          if (bestTime > existingRecord.bestTime) {
            existingRecord.bestTime = bestTime;
          }
        }
      
        // שמירת השיאים המעודכנים ב-localStorage
        localStorage.setItem('playerRecords', JSON.stringify(playerRecords));
      }
    //___________________________________________
    const player = {
        name: 'david',
       record:'00:05'
      };
    
      //Object.keys שימוש ב-
      const keys = Object.keys(player);
      console.log(keys);
      //_________________________________________________
    imageUrls = [
        'url("images/animals/1 (1).jpg")', 'url("images/animals/1 (2).jpg")', 'url("images/animals/1 (3).jpg")',
        'url("images/animals/1 (4).jpg")', 'url("images/animals/1 (5).jpg")', 'url("images/animals/1 (6).jpg")',
        'url("images/animals/1 (7).jpg")', 'url("images/animals/1 (8).jpg")', 'url("images/animals/1 (9).jpg")',
        'url("images/animals/1 (10).jpg")', 'url("images/animals/1 (11).jpg")', 'url("images/animals/1 (12).jpg")',
        'url("images/animals/1 (13).jpg")', 'url("images/animals/1 (14).jpg")'
    ];
    const bgimageUrl = 'url(images/heart.jpg)';

    //יצירת מערך אוביקטים, כל אוביקט יכיל מזהה וקישור לתמונה 
    createImageObjects = (imageUrls) => {
        return imageUrls.map((imageUrl, index) => ({//map
            id: index + 1,
            imageUrl,
        }));
    }

    const imagesObject = createImageObjects(imageUrls);

    //הכפלת המערך
    imageUrls2 = [...imagesObject, ...imagesObject]//Spread

    //ערבוב הכרטיסים
    shuffle = (imageUrls2) => {
        for (let i = imageUrls2.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imageUrls2[i], imageUrls2[j]] = [imageUrls2[j], imageUrls2[i]];
        }
        return imageUrls2;
    }

    //שמירת כרטיסים מעורבבים בתוך מערך
    const shuffledCards = shuffle(imageUrls2);

    //html תפיסת "הלוח" מ
    const board = document.querySelector("#board");

    let openedCards = [];// מערך כרטיסים פתוחים
    let scores = 0;//נקודות
    let finalTime;
    //קבצי קול
    const pressSound = document.querySelector('.press');
    const correctSound = document.querySelector('.correct');
    const wrongSound = document.querySelector('.wrong');

    //לולאה שפועלת כמספר הכרטיסים ויוצרת אותם
    for (let i = 0; i < shuffledCards.length; i++) {
        //יצירת כרטיס  חדש
        const newCard = document.createElement("div")
        //עיצוב הכרטיס
        newCard.classList.add("card");
        newCard.id = shuffledCards[i].id;
        newCard.style.backgroundImage = bgimageUrl;
        newCard.dataset.index = i;
        newCard.addEventListener('mouseover', () => {//ארוע על הכרטיס במעבר עכבר
            newCard.classList.add('hover');
        });
        newCard.addEventListener('mouseout', () => {
            newCard.classList.remove('hover');
        });

        // הוספת מאזין לאירוע לחיצה
        newCard.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            pressSound.play();
            if (openedCards.length < 2) {
                openedCards.push(newCard);//push
                newCard.classList.toggle('flipped')
                newCard.style.backgroundImage = shuffledCards[index].imageUrl;
            }
            //אם שני כרטיסים פתוחים
            if (openedCards.length === 2) {
                //אם הכרטיסים תואמים
                if (openedCards[0].id == openedCards[1].id && openedCards[0].dataset.index != openedCards[1].dataset.index) {
                    //העלמת הכרטיסים התואמים מהמסך
                    function disappearCards(cards) {
                        cards.forEach(card => {//forEach
                            card.classList.add('fading-out');
                            setTimeout(() => {
                                card.classList.add('hidden');
                            }, 1000);
                        });
                    }
                    const scoreDisplay = document.getElementById('score');
                    const dollImg = document.getElementById('doll-img');
                    //עדכון נקודות
                    function updateScore() {
                        scoreDisplay.textContent = scores; // עדכון תצוגת הניקוד עם הערך הנוכחי של scores
                    }
                    // נושא נוסף שלא למדנו - אנימציה לקפיצה של הבובה
                    function makeDollJump() {
                        dollImg.classList.add('jump');
                        dollImg.addEventListener('animationend', () => {
                            dollImg.classList.remove('jump');
                        }, { once: true });
                    }

                    disappearCards(openedCards);
                    openedCards = [];
                    scores += 100; // הוספת 100 נקודות עבור זוג תואם
                    updateScore(); // עדכון תצוגת הניקוד
                    makeDollJump();
                    if (document.querySelectorAll('.card.flipped').length === shuffledCards.length) {
                        clearInterval(timer);
                        handleGameEnd(true); // ניצחון
                    }
                    console.log(scores);
                    setTimeout(() => {
                        correctSound.play();
                    }, 1000);

                }
                else
                    //אם הכרטיסים לא תואמים
                    setTimeout(() => {
                        wrongSound.play();
                        openedCards.forEach(newCard => {//forEach
                            newCard.classList.toggle('flipped')
                            newCard.style.backgroundImage = bgimageUrl;

                        })
                        openedCards = [];
                    }, 1000)
            }

        })
        //הוספה ל "אבא" שעוטף אותם
        board.appendChild(newCard);
    }


});
//-----------------------------------------------
//localStorage הצגת נתונים ב
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(key, value);
  }
  
  //הצגת הנתונים של אובייקט ספציפי:
  const playerRecords = JSON.parse(localStorage.getItem('playerRecords'));
  console.log(playerRecords);
 //______________________________________________ 