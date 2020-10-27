const queryString = window.location.search;
console.log(queryString);
seed = new URLSearchParams(queryString).get("seed");
clock = new URLSearchParams(queryString).get("clock");
flipp2 = new URLSearchParams(queryString).get("flipp2");
if (seed != null) {
    Math.seedrandom(seed)
} else {
    seedlength = Math.floor(Math.random() * 10) + 20;
    seedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-+,.?:;[]{}()_=|!@$%^*~`'
    seed = ''
    for (i = 0; i < seedlength; i++) {
        seed = seed + seedChars[Math.floor(Math.random() * seedChars.length)]
    }
    Math.seedrandom(seed)
}
var playTimer = 99999999999999999999999999;

if (clock != null) {
    clock = Number(clock);
    if (clock == 0) {
        clock = 5;
    }
    clock += 1/120;

    var p1clock = document.createElement("div")
    p1clock.classList.add("p1clock");
    p1clock.id = "p1clock"
    document.body.appendChild(p1clock);
    p1time = clock

    var p2clock = document.createElement("div")
    p2clock.classList.add("p2clock");
    p2clock.id = "p2clock"
    document.body.appendChild(p2clock);
    p2time = clock
    p1clock.innerText = Math.floor(p1time)+":"+Math.floor((p1time*60)%60)
    p2clock.innerText = Math.floor(p2time)+":"+Math.floor((p2time*60)%60)

    setInterval(function(){
        if (playTimer < 0) {
            if (turn) {
                p1time -= 1/60
            } else {
                p2time -= 1/60
            }
        }
        playTimer -= 1;
        p1clock = document.getElementById("p1clock")
        p2clock = document.getElementById("p2clock")

        p1clock.innerText = Math.floor(p1time)+":"+Math.floor((p1time*60)%60)
        p2clock.innerText = Math.floor(p2time)+":"+Math.floor((p2time*60)%60)

    },1000)
}
if (flipp2 != null) {
    document.body.classList.toggle("flipp2")
}
if (document.getElementById("seed") != null) {
    document.getElementById("seed").innerHTML = "Seed: " + seed
}

boardWidth = Math.floor(Math.random() * 7) + 4;
boardHeight = Math.floor(Math.random() * 5) + 6;
if (standard) {
    boardWidth = 8
    boardHeight = 8
}

kingX = Math.floor(Math.random() * boardWidth);
var highlighted = false;
var turn = true;
var lastClickX = -1;
var lastClickY = -1;

Math.random()

shuffle = function(list) {
    list = list.slice();for(let i = list.length - 1; i > 0; i--){const j = Math.floor(Math.random() * i);const temp = list[i];list[i] = list[j]; list[j] = temp}return list;
}

clickBoard = function(x,y) {
    if (highlighted) {
        if (boardElems[x-1][y-1].parentElement.classList.contains("possibleSquare")) {
            playTimer = 0;
            if (board[x-1][y-1] == -1) {
                window.location.assign("p1wins.html?seed="+seed);
            } 
            if (board[x-1][y-1] == 1) {
                window.location.assign("p2wins.html?seed="+seed);
            } 
            board[x-1][y-1] = board[lastClickX-1][lastClickY-1];
            board[lastClickX-1][lastClickY-1] = 0;
            boardElems[lastClickX-1][lastClickY-1].parentElement.classList.remove("highlighted");
            
            posses = document.getElementsByClassName("possibleSquare");
            while (posses.length) {
                posses[0].classList.remove("possibleSquare");
            }
            highlighted = false;
            turn = !turn;
            document.getElementsByTagName("body")[0].classList.toggle("p2turn")
        } else {
            boardElems[lastClickX-1][lastClickY-1].parentElement.classList.remove("highlighted");
            highlighted = false;
            lastClickX = -1;
            lastClickY = -1;
            posses = document.getElementsByClassName("possibleSquare");
            while (posses.length) {
                posses[0].classList.remove("possibleSquare");
            }
        }
    } else {
        if (turn) {
            if (board[x-1][y-1] > 0) {
                boardElems[x-1][y-1].parentElement.classList.add("highlighted");
                lastClickX = x;
                lastClickY = y;
                highlighted = true;
                pieceToMoves[Math.abs(board[x-1][y-1])](x-1,y-1);
            }
        } else {
            if (board[x-1][y-1] < 0) {
                boardElems[x-1][y-1].parentElement.classList.add("highlighted");
                lastClickX = x;
                lastClickY = y;
                highlighted = true;
                pieceToMoves[Math.abs(board[x-1][y-1])](x-1,y-1);
            }
        }
    }
}

var boardElems = [];

var table = document.createElement("table");
table.className = "board";
for (var i = 1; i <= boardHeight; i++) {
    var tr = document.createElement('tr');
    tr.className = "row board";
    boardElems[i-1] = [];
    for (var j = 1; j <= boardWidth; j++) {
        var td = document.createElement('td');
        td.className = "box board";
        tr.appendChild(td);
        var img = document.createElement('img');
        td.appendChild(img);
        boardElems[i-1][j-1] = img;
        img.src = "pieceimages/0.png";
        img.className = "p0";
        td.onclick = function(){return clickBoard(this.x,this.y);};
        td.x = i;
        td.y = j;
    }
    table.appendChild(tr);
}
document.body.appendChild(table);

var board = [];
for (var i = 1; i <= boardHeight; i++) {
    temptable = [];
    for (var j = 1; j <= boardWidth; j++) {
        temptable.push(0);
    }
    board.push(temptable)
}

function isOnBoard(x,y) {
    if (x >= 0 && y >= 0 && x < boardWidth && y < boardHeight) {
        return true;
    } else {
        return false;
    }
}

function makePlayable(x,y) {
    if (x >= 0 && y >= 0 && x < boardWidth && y < boardHeight) {
        boardElems[y][x].parentElement.classList.add("possibleSquare");
        if (board[y][x] != 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function leaper(y,x,lx,ly) {
    makePlayable(x-lx,y-ly);
    makePlayable(x+lx,y-ly);
    makePlayable(x-lx,y+ly);
    makePlayable(x+lx,y+ly);
}

function oneLeaper(y,x,lx,ly) {
    if(turn) {
        ly -= ly * 2
    }
    makePlayable(x+lx,y+ly);
}

function rider(y,x,lx,ly) {
    tempx = x;
    tempy = y;
    while (tempx >= lx && tempy >= ly) {
        tempx = tempx - lx;
        tempy = tempy - ly;
        makePlayable(tempx,tempy)
        if (board[tempy][tempx] !== 0) {
            break;
        }
    }

    tempx = x;
    tempy = y;
    while (tempx < boardWidth-lx && tempy >= ly) {
        tempx = tempx + lx;
        tempy = tempy - ly;
        makePlayable(tempx,tempy)
        if (board[tempy][tempx] !== 0) {
            break;
        }
    }

    tempx = x;
    tempy = y;
    while (tempx >= lx && tempy < boardHeight-ly) {
        tempx = tempx - lx;
        tempy = tempy + ly;
        makePlayable(tempx,tempy)
        if (board[tempy][tempx] !== 0) {
            break;
        }
    }

    tempx = x;
    tempy = y;
    while (tempx < boardWidth-lx && tempy < boardHeight-ly) {
        tempx = tempx + lx;
        tempy = tempy + ly;
        makePlayable(tempx,tempy)
        if (board[tempy][tempx] !== 0) {
            break;
        }
    }
}

function oneRider(y,x,lx,ly) {
    if(turn) {
        ly -= ly * 2
    }
    if (lx <= 0 && ly <= 0) {
        tempx = x;
        tempy = y;
        while (tempx >= lx && tempy >= ly) {
            tempx = tempx + lx;
            tempy = tempy + ly;
            makePlayable(tempx,tempy)
            if (board[tempy][tempx] !== 0) {
                break;
            }
        }
    }

    if (lx > 0 && ly <= 0) {
        tempx = x;
        tempy = y;
        while (tempx < boardWidth-lx && tempy >= ly) {
            tempx = tempx + lx;
            tempy = tempy + ly;
            makePlayable(tempx,tempy)
            if (board[tempy][tempx] !== 0) {
                break;
            }
        }
    }

    if (lx <= 0 && ly > 0) {
        tempx = x;
        tempy = y;
        while (tempx >= lx && tempy < boardHeight-ly) {
            tempx = tempx + lx;
            tempy = tempy + ly;
            makePlayable(tempx,tempy)
            if (board[tempy][tempx] !== 0) {
                break;
            }
        }
    }

    if (lx > 0 && ly > 0) {
        tempx = x;
        tempy = y;
        while (tempx < boardWidth-lx && tempy < boardHeight-ly) {
            tempx = tempx + lx;
            tempy = tempy + ly;
            makePlayable(tempx,tempy)
            if (board[tempy][tempx] !== 0) {
                break;
            }
        }
    }
}

pieceToMoves = [function(x,y){leaper(x,y,1,1);leaper(x,y,1,0);leaper(x,y,0,1);},
    function(x,y) {
        if (turn) {
            if (isOnBoard(y,x-1)) {
                if (board[x-1][y] == 0) {
                    makePlayable(y,x-1)
                }
            }
            if(isOnBoard(y-1,x-1)) { 
                if (board[x-1][y-1] !== 0) {
                    makePlayable(y-1,x-1)
                }
            }
            if(isOnBoard(y+1,x-1)) {
                if (board[x-1][y+1] !== 0) {
                    makePlayable(y+1,x-1)
                }
            }
        } else {
            if (isOnBoard(y,x+1)) {
                if (board[x+1][y] == 0) {
                    makePlayable(y,x+1)}
            }
            if(isOnBoard(y-1,x+1)) { 
                if (board[x+1][y-1] !== 0) {
                    makePlayable(y-1,x+1)
                }
            }
            if(isOnBoard(y+1,x+1)) {
                if (board[x+1][y+1] !== 0) {
                    makePlayable(y+1,x+1)
                }
            }
        }},
    function(x,y){rider(x,y,1,0);rider(x,y,0,1);},
    function(x,y){rider(x,y,1,1)},
    function(x,y){leaper(x,y,1,2);leaper(x,y,2,1);},
    function(x,y){rider(x,y,1,0);rider(x,y,1,1);rider(x,y,0,1);},
    function(x,y){leaper(x,y,1,0);leaper(x,y,0,1)},
    function(x,y){leaper(x,y,1,1)},
    function(x,y){rider(x,y,1,2);rider(x,y,2,1);},
    function(x,y){leaper(x,y,1,3);leaper(x,y,3,1);},
    function(x,y){leaper(x,y,3,2);leaper(x,y,2,3);},
    function(x,y){leaper(x,y,2,2);},
    function(x,y){leaper(x,y,0,2);leaper(x,y,2,0);},
    function(x,y){leaper(x,y,3,3);},
    function(x,y){leaper(x,y,0,3);leaper(x,y,3,0);},
    function(x,y){rider(x,y,1,1);leaper(x,y,0,2);leaper(x,y,2,0);},
    function(x,y){leaper(x,y,1,0);leaper(x,y,0,1);leaper(x,y,2,2);},
    function(x,y){leaper(x,y,1,1);leaper(x,y,2,2);leaper(x,y,0,2);leaper(x,y,2,0);},
    function(x,y){leaper(x,y,1,2);leaper(x,y,2,1);rider(x,y,1,1)},
    function(x,y){leaper(x,y,1,2);leaper(x,y,2,1);leaper(x,y,1,1)},
    function(x,y){leaper(x,y,1,1);leaper(x,y,0,2);leaper(x,y,2,0)},
    function(x,y){rider(x,y,1,3);rider(x,y,3,1);},
    function(x,y){rider(x,y,3,2);rider(x,y,2,3);},
    function(x,y){leaper(x,y,1,0);leaper(x,y,2,0);leaper(x,y,0,1);leaper(x,y,0,2);},
    function(x,y){oneRider(x,y,0,1);oneLeaper(x,y,-1,-1);oneLeaper(x,y,0,-1);oneLeaper(x,y,1,-1),rider(x,y,1,0)},
    function(x,y){leaper(x,y,1,1);oneLeaper(x,y,-1,2);oneLeaper(x,y,1,2);oneLeaper(x,y,-1,-2);oneLeaper(x,y,1,-2)},
    function(x,y){leaper(x,y,1,0);oneLeaper(x,y,0,-1);oneLeaper(x,y,-1,2);oneLeaper(x,y,1,2);oneLeaper(x,y,-2,1);oneLeaper(x,y,2,1);oneLeaper(x,y,1,-1);oneLeaper(x,y,-1,-1)},
    function(x,y){oneRider(x,y,0,1);oneLeaper(x,y,0,-1)},
    function(x,y){oneLeaper(x,y,1,1);oneLeaper(x,y,-1,1);leaper(x,y,0,1);},
    function(x,y){leaper(x,y,1,1);leaper(x,y,1,0);},
    function(x,y){leaper(x,y,1,0);oneRider(x,y,0,-1);oneLeaper(x,y,0,1);},
    function(x,y){leaper(x,y,1,0);rider(x,y,0,1);},
    function(x,y){leaper(x,y,0,1);rider(x,y,1,0);},
    function(x,y){leaper(x,y,1,1);rider(x,y,1,0);},
    function(x,y){leaper(x,y,1,1);leaper(x,y,2,0);},
    function(x,y){leaper(x,y,1,0);oneLeaper(x,y,-1,1);oneLeaper(x,y,1,1);oneLeaper(x,y,0,-1);},
    function(x,y){leaper(x,y,1,0);leaper(x,y,0,1);oneLeaper(x,y,-1,1);oneLeaper(x,y,1,1);},
    function(x,y){leaper(x,y,1,1);oneRider(x,y,0,-1)},
    function(x,y){leaper(x,y,1,0);leaper(x,y,0,1);leaper(x,y,0,2);},
    function(x,y){leaper(x,y,1,2);leaper(x,y,2,1);rider(x,y,1,0);rider(x,y,1,1);rider(x,y,0,1);},
    function(x,y){leaper(x,y,1,3);leaper(x,y,3,1);leaper(x,y,3,2);leaper(x,y,2,3);},
    function(x,y){leaper(x,y,2,1);leaper(x,y,0,1)},
    function(x,y){leaper(x,y,1,0);leaper(x,y,0,1);leaper(x,y,2,0);leaper(x,y,0,2);leaper(x,y,2,1);leaper(x,y,1,2);},
    function(x,y){leaper(x,y,1,0);oneLeaper(x,y,0,-1);oneLeaper(x,y,0,2);},
    function(x,y) {
        if (turn) {
            if (board[x-1][y] == 0) {
                makePlayable(y,x-1) && (x==boardHeight-2)
            }
            if(isOnBoard(y+1,x-1)) {
                if (board[x-1][y+1] !== 0) {
                    makePlayable(y+1,x-1)
                }
            }
        } else {
            if (board[x+1][y] == 0) {
                makePlayable(y,x+1)
            }
            if(isOnBoard(y-1,x+1)) { 
                if (board[x+1][y-1] !== 0) {
                    makePlayable(y-1,x+1)
                }
            }
            if(isOnBoard(y+1,x+1)) {
                if (board[x+1][y+1] !== 0) {
                    makePlayable(y+1,x+1)
                }
            }
        }},
    function(x,y){leaper(x,y,1,3);leaper(x,y,3,1);leaper(x,y,1,2);leaper(x,y,2,1);},
    function(x,y){leaper(x,y,1,3);leaper(x,y,3,1);leaper(x,y,1,2);leaper(x,y,2,1);leaper(x,y,2,3);leaper(x,y,3,2);},
    function(x,y){leaper(x,y,1,1);leaper(x,y,1,2);leaper(x,y,2,1);leaper(x,y,2,2);},
    function(x,y){rider(x,y,2,2);leaper(x,y,1,1)},
    function(x,y){rider(x,y,1,0);leaper(x,y,2,0);rider(x,y,0,1);leaper(x,y,0,2)},
    
]

if (!standard) {
    pieceToMoves = shuffle(pieceToMoves);

}

pieceToMoves.unshift(function(x,y){});

pieceToImage = [19,15,16,17,18,20,1,2,3,4,5,6,7,8,9,10,11,12,13,14,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70];

if (!standard) {
    pieceToImage = shuffle(pieceToImage);

}
pieceToImage.unshift(0);

for (var i = 0; i < boardWidth; i++) {
    board[boardHeight-2][i] = 2;
}

for (var i = 0; i < boardWidth; i++) {
    if (mirror) {
        board[1][i] = -2;

    } else {
        board[1][i] = -2-boardWidth;

    }
}

for (var i = 0; i < boardWidth; i++) {
    if (i < kingX) {
        board[boardHeight-1][i] = i+3;
    } else if (i == kingX) {
        board[boardHeight-1][i] = 1;
    } else if (i > kingX) {
        board[boardHeight-1][i] = i + 2;
    }
}

for (var i = 0; i < boardWidth; i++) {
    if (mirror) {
        if (i < kingX) {
            board[0][boardWidth-i-1] = -i-3;
        } else if (i == kingX) {
            board[0][boardWidth-i-1] = -1;
        } else if (i > kingX) {
            board[0][boardWidth-i-1] = -i-2;
        }

    } else {
        if (i < kingX) {
            board[0][boardWidth-i-1] = -i-boardWidth-3;
        } else if (i == kingX) {
            board[0][boardWidth-i-1] = -1;
        } else if (i > kingX) {
            board[0][boardWidth-i-1] = -i-boardWidth-2;
        }

    }
}

if (standard) {
    board[0] = [-3,-5,-4,-6,-1,-4,-5,-3]
    board[1] = [-2,-2,-2,-2,-2,-2,-2,-2]
    board[7] = [3,5,4,6,1,4,5,3]
}

updateBoard = function() {
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            value = board[i][j];
            img = boardElems[i][j];
            isHighlighted = img.parentElement.classList.contains("highlighted");
            
            isPossible = img.parentElement.classList.contains("possibleSquare");
            if (value == 0) {
                img.className = "p0";
                img.src = "pieceimages/0.png";
                continue;
            }
            if (value < 0) {
                if (value == -1) {
                    img.className = "p2royal";
                } else {
                    img.className = "p2";
                }
            } else {
                if (value == 1) {
                    img.className = "p1royal";
                } else {
                    img.className = "p1";
                }
            }
            if (isHighlighted) {
                img.parentElement.classList.add("highlighted");
            }
            
            if (isPossible) {
                img.parentElement.classList.add("possibleSquare");
            }
            value = Math.abs(value);
            img.src = "pieceimages/"+pieceToImage[value]+".png";
        }
    }
}

setInterval(updateBoard, 150)

function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}

if (document.getElementById("combinationcount") != null) {
    combinations = 0;
    for (i=4; i<11; i++) {
        numImageFactorials = factorial(pieceToImage.length-1)/factorial(pieceToImage.length-2-i*2);
        numBoardHeights = 6;
        numMoveFactorials = factorial(pieceToMoves.length-1)/factorial(pieceToMoves.length-2-i*2);
        combinations += numImageFactorials*numBoardHeights*numMoveFactorials;
    }
    document.getElementById("combinationcount").innerHTML = combinations + " combinations"
}