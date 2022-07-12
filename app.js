document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    let scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-btn');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    // The Terominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width*2+1],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currPos = 4;  //current position
    let currRot = 0;  //current rotation

    //randomly select a tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let curr = theTetrominoes[random][currRot]; //current tetromino

    //draw the tetromino
    function draw(){
        curr.forEach(index => {
            squares[currPos + index].classList.add('tetromino');
            squares[currPos + index].style.backgroundColor = colors[random];
        }) 
    } 

    draw();

    //undraw the tetromino
    function undraw(){
        curr.forEach(index => {
            squares[currPos + index].classList.remove('tetromino');
            squares[currPos + index].style.backgroundColor = '';
        })
    }

    //assign functions to keyCodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }else if(e.keyCode === 39){
            moveRight();
        }else if(e.keyCode === 38){
            rotate();
        }
    }
    document.addEventListener('keyup', control);

    //moveDown function
    function moveDown(){
        undraw();
        currPos += width;
        draw();
        freeze();
    }

    //freeze function
    function freeze(){
        if(curr.some(index => squares[currPos + index + width].classList.contains('taken'))){
            curr.forEach(index => squares[currPos + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            curr = theTetrominoes[random][currRot];
            currPos = 4;
            draw();  
            displayShape();
            addScore();
            gameOver();
        }
    }

    //move the tetromino left ,unless is at the edge or there is a blockage
    function moveLeft(){
        undraw();
        const isAtLeftEdge = curr.some(index => (currPos + index) % width === 0);

        if(!isAtLeftEdge){
            currPos -= 1;
        }

        if(curr.some(index => squares[currPos + index].classList.contains('taken'))){
            currPos += 1;
        }

        draw();
    } 

    //move tetromino to the right 
    function moveRight(){
        undraw();
        const isAtRightEdge = curr.some(index => (currPos + index) % width === width-1);

        if(!isAtRightEdge){
            currPos += 1;
        }

        if(curr.some(index => squares[currPos + index].classList.contains('taken'))){
            currPos -= 1;
        }

        draw();
    }

    //rotate the tetromino 
    function rotate(){
        undraw();
        currRot++;
        if(currRot === curr.length){  //if current rotaion gets to 4, make it go back to zero
            currRot = 0;
        }
        curr = theTetrominoes[random][currRot];
        draw();
    }

    //show up next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1,displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]; 

    //display the shape in the mini-grid display
    function displayShape(){
        //remove any trace of tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () =>{
        if(timerId){
            clearInterval(timerId);
            timerId = null;
        }else{
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })   

    //add score to the browser
    function addScore(){
        for(let i=0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //game over
    function gameOver(){
        if(curr.some(index => squares[currPos + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
});
