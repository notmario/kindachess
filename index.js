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

var colour = Math.floor(Math.random()*360)

shuffle = function(list) {
    list = list.slice();for(let i = list.length - 1; i > 0; i--){const j = Math.floor(Math.random() * i);const temp = list[i];list[i] = list[j]; list[j] = temp}return list;
}

clickBoard = function(x,y) {
    if (highlighted) {
        if (boardElems[x-1][y-1].parentElement.classList.contains("possibleSquare")) {
            if (board[x-1][y-1] == -1) {
                window.location.replace("p1wins.html");
            } 
            if (board[x-1][y-1] == 1) {
                window.location.replace("p2wins.html");
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

function isNSpacesFromStart(piece,y,n) {
    if (piece < 0) {
        if (y == n) {
            return true;
        } else {
            return false;
        }
    } else if (piece > 0) {
        if (y == boardHeight - n) {
            return true;
        } else {
            return false;
        }
    }
}


pieceToMoves = [function(x,y){leaper(x,y,1,1);leaper(x,y,1,0);leaper(x,y,0,1);},
    function(x,y) {
        if (turn) {
            if (board[x-1][y] == 0) {
                if (!makePlayable(y,x-1) && isNSpacesFromStart(board[x][y],x,2)) {
                    makePlayable(y,x-2)
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
            if (board[x+1][y] == 0) {
                if (!makePlayable(y,x+1) && (x==1)) {
                    makePlayable(y,x+2)
                }
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
            if (board[x-1][y-1] == 0) {
                if (!makePlayable(y-1,x-1) && isNSpacesFromStart(board[x][y],x,2)) {
                    makePlayable(y-2,x-2)
                }
            }
            if (board[x-1][y+1] == 0) {
                if (!makePlayable(y+1,x-1) && isNSpacesFromStart(board[x][y],x,2)) {
                    makePlayable(y+2,x-2)
                }
            }
            if(isOnBoard(y,x-1)) { 
                if (board[x-1][y] !== 0) {
                    makePlayable(y,x-1)
                }
            }
        } else {
            if (board[x+1][y-1] == 0) {
                if (!makePlayable(y-1,x+1) && (x==1)) {
                    makePlayable(y-2,x+2)
                }
            }
            if (board[x+1][y+1] == 0) {
                if (!makePlayable(y+1,x+1) && (x==1)) {
                    makePlayable(y+2,x+2)
                }
            }
            if(isOnBoard(y,x+1)) { 
                if (board[x+1][y] !== 0) {
                    makePlayable(y,x+1)
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
    //pieceToMoves = shuffle(pieceToMoves);

}

///*
for (i=0; i<= 100; i++) {
    pieceToMoves.unshift(pieceToMoves[pieceToMoves.length-1])

}
//*/
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