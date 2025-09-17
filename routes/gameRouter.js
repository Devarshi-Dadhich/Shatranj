
import { Router } from "express";

export default function Gamerouter(moves = []){
    const router = Router();
    router.get("/", (req, res) => {
    res.render("game",{movesList:moves});
    console.log(moves);
    });
    return router; 
} 