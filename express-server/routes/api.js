const express = require('express');
const { Movie, validade } = require('../model/Movie');

const router = express.Router();

/*_ GET api listing. _*/
router.get('/', (req, res) => {
    res.send('api works 100%');
});

module.exports = router;