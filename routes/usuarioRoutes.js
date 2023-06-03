import express from "express";

const router = express.Router();

router.route('/')
    .get((require, response) => {
        response.json({msg:'Hola mundo en express'} )
    })

export default router;