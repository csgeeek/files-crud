const express = require('express');
const router = express.Router();

router.get(['/', '/home'], (req, res) => {
    res.render('home');
});

router.get('/course-1', (req, res) => {
    res.render('course-1');
});

router.get('/course-2', (req, res) => {
    res.render('course-2');
});

router.get('/course-3', (req, res) => {
    res.render('course-3');
});

router.get('/teachers', (req, res) => {
    res.render('teachers');
});

router.get('/blog', (req, res) => {
    res.render('blog');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;