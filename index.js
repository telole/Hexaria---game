document.addEventListener('DOMContentLoaded', () => {
    const player1Name = sessionStorage.getItem('player1');
    const player2Name = sessionStorage.getItem('player2');
    const difficulty = sessionStorage.getItem('level'); 

    
    if (player1Name) {
        document.getElementById('player1').textContent = player1Name;
    }

    if (player2Name) {
        document.getElementById('player2').textContent = player2Name;
    }

    // const urlParams = new URLSearchParams(window.location.search)
    // const player1 = urlParams.get('player1')
    // const player2 = urlParams.get('player2')
    // const mode = urlParams.get('level')
    

        // const player1Nam = sessionStorage.getItem('player1');
        // const player2Nam = sessionStorage.getItem('player2');

        // if (player1Nam) {
        //     document.getElementById('player1').textContent = player1Name;
        // }

        // if (player2Nam) {
        //     document.getElementById('player2').textContent = player2Name;
        // }
    
    

    const mainAudio = document.getElementById('mainAudio')
    mainAudio.play()
    mainAudio.loop = true
    const gameBoard = document.getElementById('game-board');
    const currentHex = document.querySelector('.current-hex .hexagon .main');
    const rows = 8;
    const cols = 10;


    // const player1Name = sessionStorage.getItem('player1');
    // const player2Name = sessionStorage.getItem('player2');

    console.log(player1Name);

    // document.addEventListener('DOMContentLoaded', () => {
    //     const player1Name = sessionStorage.getItem('player1');
    //     const player2Name = sessionStorage.getItem('player2');
    //     if (player1Name) {
    //         document.getElementById('player1-name').textContent = player1Name;
    //     }
    
    //     if (player2Name) {
    //         document.getElementById('player2').textContent = player2Name;
    //     }
    // });
    

    // if (player1Name) {
    //     document.getElementById('player1-name').textContent = player1Name;
    // }
    // if (player2Name) {
    //     document.getElementById('player2-name').textContent = player2Name;
    // }
    // const rows = 2;
    // const cols = 3;
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let filledHexagon = 0;

    // Disabled Hex Featured
    let disabledHexCount = 0
    let disabledHexPosition = []

    // Initialize display value
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
        // const player1Name = document.getElementById('player1-name')
        // const player2Name = document.getElementById('player2-name')

    setRandomValue(currentHex);
    setCurrentHexColor();

    // Display Data on Screen
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
    // player1Name.textContent = player1;
    // player2Name.textContent = player2;

    // console.log(player1Name);

    console.log({TotalHexagon: rows * cols});

    // const difficulty = urlParams.get('level')
    // const difficulty = sessionStorage.getItem('level'); // Get difficulty level from sessionStorage

    if (difficulty === 'easy') {
        disabledHexCount = 3; 
    } else if (difficulty === 'medium') {
        disabledHexCount = 5;  
    } else if (difficulty === 'hard') {
        disabledHexCount = 7 ;  
    }
    
    
    // random dsble
    while (disabledHexPosition.length <= disabledHexCount) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)
        const position = `${randomRow}, ${randomCol}`
        if (!disabledHexPosition.includes(position)) {
            disabledHexPosition.push(position);
        }
    }   


    console.log({disabledHexPosition: disabledHexPosition.length});
    const leaderboardArea = document.querySelector('.leaderboard-area');
    const parsingData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const numEntries = 5;
    const startIndex = Math.max(parsingData.length - numEntries, 0);
    const leaderboardData = parsingData.slice(startIndex);


        leaderboarddata.forEach(entry => {
        const leaderboardDetails = document.createElement('div');
        leaderboardDetails.classList.add('leaderboard-details');
        const playerNameText = `${entry.player1.name} vs ${entry.player2.name}`;
        const playerScoreText = `${entry.player1.score} - ${entry.player2.score}`;
    
        leaderboardDetails.innerHTML = `
            <h1 class="players-name">${playerNameText}</h1>
            <div class="score-details">
                <h1 class="score">${playerScoreText}</h1>
                <button class="btn-leaderboard">Show Details</button>
            </div>
        `;
        leaderboardArea.appendChild(leaderboardDetails);
    });
    
    console.log({ Turn: currentPlayer });

    for (let row = 1; row <= rows; row++) {
        const hexRow = document.createElement('div');
        hexRow.classList.add('hex-row');
        if (row % 2 === 1) {
            hexRow.classList.add('even');
        }

        for (let col = 0; col < cols; col++) {
            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            hexagon.dataset.row = row;
            hexagon.dataset.col = col;

            const topDiv = document.createElement('div');
            topDiv.classList.add('top');

            const mainDiv = document.createElement('div');
            mainDiv.classList.add('main');

            const bottomDiv = document.createElement('div');
            bottomDiv.classList.add('bottom');

            hexagon.appendChild(topDiv);
            hexagon.appendChild(mainDiv);
            hexagon.appendChild(bottomDiv);

            const position = `${row}, ${col}`
            if (disabledHexPosition.includes(position)) {
                hexagon.classList.add('disabled')
            }

            hexagon.addEventListener('click', () => {
                if (hexagon.dataset.owner || hexagon.classList.contains('disabled')) {
                    return;
                }

                const randomValue = parseInt(currentHex.textContent);
                setHexagonValue(hexagon, randomValue);

                hexagon.dataset.owner = currentPlayer;

                const mainColor = currentPlayer === 1 ? 'red' : 'cyan';
                mainDiv.style.backgroundColor = mainColor;
                topDiv.style.borderBottomColor = mainColor; 
                bottomDiv.style.borderTopColor = mainColor;

                calculateScore(hexagon);
                checkAndCaptureNeighbours(hexagon);
                filledHexagon++;
                console.log({filledHexagon});
                currentPlayer = currentPlayer === 1 ? 2 : 1;

                setCurrentHexColor();
                setRandomValue(currentHex);
                
                if (difficulty === 'bot' && currentPlayer === 2) {
                    playerBotTurn()
                }

                console.log({filledHexagon});
                console.log({disabledHexCount});
                console.log({total: rows * cols});
                decideWinner()
            });

            hexRow.appendChild(hexagon);
        }

        gameBoard.appendChild(hexRow);
    }


    const hexagonDisabled = document.querySelectorAll('.disabled')
    const countHexagonDisabled = hexagonDisabled.length
    console.log({countHexagonDisabled});

    function setHexagonValue(hexagon, value) {
        const mainDiv = hexagon.querySelector('.main');
        mainDiv.textContent = value;
    }

    function setRandomValue(hexagon) {
        const randomValue = Math.floor(Math.random() * 20) + 1; 
        setHexagonValue(hexagon.parentElement, randomValue);
    }

    function setCurrentHexColor() {
        const mainColor = currentPlayer === 1 ? 'red' : 'cyan';
        const currentHexTop = document.querySelector('.current-hex .hexagon .top');
        const currentHexBottom = document.querySelector('.current-hex .hexagon .bottom');

        currentHex.style.backgroundColor = mainColor;
        currentHexTop.style.borderBottomColor = mainColor;
        currentHexBottom.style.borderTopColor = mainColor;
    }

    function calculateScore(hexagon) {
        const row = parseInt(hexagon.dataset.row);
        const col = parseInt(hexagon.dataset.col);
        const owner = currentPlayer;
        const mainValue = parseInt(hexagon.querySelector('.main').textContent);

        const directions = [
            { row: -1, col: 0 }, // atas
            { row: 1, col: 0 },  // bawah
            { row: 0, col: -1 }, // kiri
            { row: 0, col: 1 },  // kanan
            { row: -1, col: 1 }, // atas-kanan
            { row: 1, col: -1 }, // bawah-kiri
        ];

        let scoreToAdd = mainValue; 
        let visitedHexagons = new Set();

        for (const dir of directions) {
            const neighborRow = row + dir.row;
            const neighborCol = col + dir.col;
            const neighborHexagon = document.querySelector(`[data-row="${neighborRow}"][data-col="${neighborCol}"]`);

            if (neighborHexagon && neighborHexagon.dataset.owner && parseInt(neighborHexagon.dataset.owner) === owner) {
                const neighborValue = parseInt(neighborHexagon.querySelector('.main').textContent);

                if (!visitedHexagons.has(`${neighborRow},${neighborCol}`)) {
                    // rebut jika nomor lebih besar
                    scoreToAdd += neighborValue;
                    visitedHexagons.add(`${neighborRow},${neighborCol}`);
                }
            }
        }

        if (scoreToAdd > mainValue) {
            if (currentPlayer === 1) {
                player1Score += scoreToAdd;
                player1ScoreDisplay.textContent = player1Score;
            } else {
                player2Score += scoreToAdd;
                player2ScoreDisplay.textContent = player2Score;
            }
        }
    }

    function checkAndCaptureNeighbours(hexagon) {
        const row = parseInt(hexagon.dataset.row);
        const col = parseInt(hexagon.dataset.col);
        const owner = currentPlayer;
        const mainValue = parseInt(hexagon.querySelector('.main').textContent);

        const directions = [
            { row: -1, col: 0 }, // atas
            { row: 1, col: 0 },  // bawah
            { row: 0, col: -1 }, // kiri
            { row: 0, col: 1 },  // kanan
            { row: -1, col: 1 }, // atas-kanan(diagonal)
            { row: 1, col: -1 }, // bawah-kiri(diagonal)
        ];

        for (const dir of directions) {
            const neighborRow = row + dir.row;
            const neighborCol = col + dir.col;
            const neighborHexagon = document.querySelector(`[data-row="${neighborRow}"][data-col="${neighborCol}"]`);

            if (neighborHexagon && neighborHexagon.dataset.owner && parseInt(neighborHexagon.dataset.owner) !== currentPlayer) {
                const neighborMainValue = parseInt(neighborHexagon.querySelector('.main').textContent);

                if (neighborMainValue < mainValue) {
                    neighborHexagon.dataset.owner = currentPlayer;
                    calculateScore(hexagon)
                    const mainColor = currentPlayer === 1 ? 'red' : 'cyan';
                    neighborHexagon.querySelector('.main').style.backgroundColor = mainColor;
                    neighborHexagon.querySelector('.top').style.borderBottomColor = mainColor;
                    neighborHexagon.querySelector('.bottom').style.borderTopColor = mainColor;
                }
            }
        }
    }

    function playerBotTurn() {
        const emptyHexagon = Array.from(document.querySelectorAll('.game-board .hexagon:not([data-owner])'));
  
        const validEmptyHexagon = emptyHexagon.filter(hexagon => !hexagon.classList.contains('disabled'));
        console.log({validEmptyHexagon});
        if (validEmptyHexagon.length > 0) {
            const randomIndex = Math.floor(Math.random() * validEmptyHexagon.length);
            const botHexagon = validEmptyHexagon[randomIndex];
    
            const randomValue = Math.floor(Math.random() * 20) + 1;
            setHexagonValue(botHexagon, randomValue);
            botHexagon.dataset.owner = 2;
    
            const mainColor = 'cyan';
            botHexagon.querySelector('.main').style.backgroundColor = mainColor;
            botHexagon.querySelector('.top').style.borderBottomColor = mainColor;
            botHexagon.querySelector('.bottom').style.borderTopColor = mainColor;
    
            calculateScore(botHexagon);
            checkAndCaptureNeighbours(botHexagon);
            filledHexagon++;
    
            currentPlayer = 1;
            setCurrentHexColor();
        }
    }
    

    function saveScoreToLocalStorage(player1Name, player1Score, player2Name, player2Score) {
        const leaderboardEntry = {
            player1: {
                name: player1Name,
                score: player1Score
            },
            player2: {
                name: player2Name,
                score: player2Score
            }
        };

        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(leaderboardEntry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    
    // function decideWinner() {
    //     if (filledHexagon + countHexagonDisabled === rows * cols) {
    //         let winner = '';
    //         if (player1Score > player2Score) {
    //             winner = player1;
    //             alert(`${player1} wins with the highest score!`);
    //         } else if (player1Score < player2Score) {
    //             winner = player2;
    //             alert(`${player2} wins with the highest score!`);
    //         } else {
    //             alert('GAME DRAW');
    //             return; // Jika draw, tidak perlu menyimpan ke leaderboard
    //         }
    
    //         // Simpan skor ke Local Storage
    //         saveScoreToLocalStorage(player1, player1Score, player2, player2Score);
    //     }
    // }


    function decideWinner() {
        if (filledHexagon + countHexagonDisabled === rows * cols) {
            let winner = '';
            if (player1Score > player2Score) {
                winner = player1Name;
                alert(`${player1Name} menang dengan skor tertinggi!`);
            } else if (player1Score < player2Score) {
                winner = player2Name;
                alert(`${player2Name} menang dengan skor tertinggi!`);
            } else {
                alert('Permainan Seri!');
                return;
            }

            saveScoreToLocalStorage(player1Name, player1Score, player2Name, player2Score);
        }
    }
    
    
    function saveScoreToLocalStorage(player1Name, player1Score, player2Name, player2Score) {
        const gameResult = {
            player1: { name: player1Name, score: player1Scorex`` },
            player2: { name: player2Name, score: player2Score }
        };
    
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(gameResult);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    
});
