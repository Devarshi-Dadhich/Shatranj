document.addEventListener("DOMContentLoaded", () => {
const socket = io();
const chess = new Chess(); 
const board = document.querySelector('.board');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const chessBoard = chess.board();
    board.innerHTML = '';
    chessBoard.forEach((row, rowIndex)=>{
        row.forEach((square, squareIndex)=>{
            let squareDiv = document.createElement('div');
            squareDiv.classList.add('square',
                (rowIndex + squareIndex) % 2 === 0 ? 'light' : 'dark'
            );
            squareDiv.dataset.row = rowIndex;
            squareDiv.dataset.col = squareIndex;

            if(square) {
                let pieceDiv = document.createElement('div');
                pieceDiv.classList.add('piece', square.color === 'w' ? 'white' : 'black');
                pieceDiv.innerHTML = Unicodes(square);
                pieceDiv.draggable = playerRole === square.color;

                pieceDiv.addEventListener('dragstart', (event) => {
                if(pieceDiv.draggable) {
                    draggedPiece = pieceDiv;
                    sourceSquare = {row: rowIndex, col: squareIndex};
                    event.dataTransfer.setData('text/plain',"");
                    setTimeout(() => {
                        pieceDiv.style.visibility = "hidden";
                    }, 0);
                }

                });
                pieceDiv.addEventListener('dragend', () => {
                    draggedPiece = null;
                    sourceSquare = null;
                    pieceDiv.style.visibility = "visible";
                });

                squareDiv.appendChild(pieceDiv);
            };
            
            squareDiv.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            squareDiv.addEventListener('drop', (event) => {
                event.preventDefault();
                if(draggedPiece){
                    const TargetSquare = {
                        row:parseInt(squareDiv.dataset.row),
                        col:parseInt(squareDiv.dataset.col)
                    }
                    moveHandler(sourceSquare, TargetSquare);
                };
        });
        board.appendChild(squareDiv);


        });
    });
    if (playerRole === 'b') {
        board.classList.add('flipped');
    }
    else{
        board.classList.remove('flipped');
    }
    // console.log("renderBoard called, FEN:", chess.fen());
}

const moveHandler = (sourceSquare, TargetSquare) => {
    const move = {
        from:`${String.fromCharCode(97 + sourceSquare.col)}${8-sourceSquare.row}`,
        to: `${String.fromCharCode(97 + TargetSquare.col)}${8-TargetSquare.row}`
    }

    socket.emit("move", move);
};

const Unicodes = (piece) => {
    const Unicodes = {
        K: "♔",  // King
        Q: "♕",  // Queen
        R: "♖",  // Rook
        B: "♗",  // Bishop
        N: "♘",  // Knight
        P: "♙",  // Pawn
        k: "♚",  // King
        q: "♛",  // Queen
        r: "♜",  // Rook
        b: "♝",  // Bishop
        n: "♞",  // Knight
        p: "♟"   // Pawn
    }
    return Unicodes[piece.type] || "";
};

socket.on("startGame", (fen) => {
    chess.load(fen);
    renderBoard();
    alert("Game Started! 🎮");
});

socket.on("playerRole", (role) => {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", () => {
    playerRole = null; // Spectators cannot make moves
    renderBoard();
});

socket.on("updateBoard", (state) => {
    // console.log(state);
    chess.load(state);
    renderBoard();
    board.offsetHeight;
});
socket.on("gameResult", (data) => {
    if (data.status === "win") {
        alert("🎉 Congratulations! You won the game!");
        console.log("Game Over! Winner")
    } else if (data.status === "lose") {
        alert("😔 Better luck next time!");
        console.log("Game Over! Loser")
    } else if (data.status === "draw") {
        alert("🤝 It's a draw!");
        console.log("Game Over! Draw")
    }
});

renderBoard();
})
