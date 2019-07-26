const express = require('express');
const { Movie, validade } = require('../model/Movie');

const router = express.Router();

/*_ GET api listing. _*/
router.get('/', (req, res) => {
    res.send('api works 100%');
});

router.get('/movies', async (req, res) => {
    const movies = await Movie.find({});
    res.send(movies);
});

module.exports = router;