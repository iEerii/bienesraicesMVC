import express from "express";

const router = express.Router();

router.get('/login', (require, response) => {
        response.render('auth/login')
    })

export default router;