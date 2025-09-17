import express from 'express';
import http from 'http';    
import {Chess} from 'chess.js';
import {Server} from 'socket.io';
import path from 'path';
import Gamerouter from './routes/gameRouter.js';

const app = express();
const server = http.createServer(app);

export const io = new Server(server) 

const chess = new Chess();  

const players = {};
let currentPlayer = "w";
let readyPlayers = {};

const ___dirname = path.join("./");

app.use(express.static(path.join('public',___dirname)));
app.set("view engine", "ejs");

const moves = [];
app.use("/game",Gamerouter(moves));

app.get("/", (req, res) => {
    res.render("index");
});


io.on("connection", (socket) => {
    if(!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
        socket.emit("updateBoard", chess.fen());
    }
    else if(!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
        socket.emit("updateBoard", chess.fen());
    } else {
        socket.emit("gameFull");
        return;
    }
    socket.on("playerReady", () => {
        if (socket.id === players.white || socket.id === players.black) {
            readyPlayers[socket.id] = true;
            if (players.white && players.black && readyPlayers[players.white] && readyPlayers[players.black]) {
                io.emit("startGame", chess.fen());
            }
        }
    });
    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            delete players.white;
        } else if (socket.id === players.black) {
            delete players.black;
        }
        delete readyPlayers[socket.id];
    });

    socket.on("move",(move) => {
        console.log(move); 
        try{
            if(chess.turn() === "w" && socket.id !==players.white) {
                socket.emit("notYourTurn");
                return;
            }
            if(chess.turn() === "b" && socket.id !==players.black) {
                socket.emit("notYourTurn");
                return;
            }
            
            const result = chess.move(move);
            // Gamerouter(result);
            console.log(result);
            if(result){
                moves.push(move)
                currentPlayer = chess.turn();
                io.emit("move",move)
                io.emit("updateBoard", chess.fen());
                // console.log(chess.fen());
                
                if(chess.isGameOver() && chess.isCheckmate()) {
                    const winner = chess.turn() === 'w' ? 'b' : 'w';
                    const winnerId = winner === 'w' ? players.white : players.black;
                    const loserId = winner === 'w' ? players.black : players.white;

                    io.to(winnerId).emit("gameResult", { status: "win" });
                    io.to(loserId).emit("gameResult", { status: "lose" });
                }
                if (chess.isStalemate() || chess.isThreefoldRepetition()) {
                    io.emit("gameResult", { status: "draw" });
                }

            }
            else{
                socket.emit("invalidMove");
            }
        }
        catch(error){
            socket.emit("invalidMove");
        }
    });
    // console.log("A user connected");
});

server.listen(process.env.PORT || 3000, () => {
    // console.log("Server is running on port 3000");
});
