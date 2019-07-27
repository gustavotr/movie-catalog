const express = require('express');
const { Movie, validate, parse } = require('../model/Movie');

const router = express.Router();
const REQUEST_ITEMS_LIMIT = 50;

/* _ GET api listing._ */
router.get('/', (req, res) => {
  res.send('api works 100%');
});

router.get('/movies', async (req, res) => {
  const { query } = req;
  const limit = (query.limit) ? parseInt(query.limit, 10) : REQUEST_ITEMS_LIMIT;
  const offset = (query.offset) ? parseInt(query.offset, 10) : 0;
  const movies = await Movie.find({}).limit(limit).skip(offset);
  res.send(movies);
});


router.post('/movies', async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) return (res.status(400).send(error.details[0].message));

    const m = parse(req.body);
    const movie = new Movie(m);

    res.status(201).json(await movie.save());
  } catch (error) {
    res.status(500).send(error.message);
  }
  return null;
});

router.put('/movies', async (req, res) => {
  const id = req.body._id;
  delete (req.body._id);
  const movie = req.body;
  Movie.findByIdAndUpdate(
    id,
    movie,
    { new: true, useFindAndModify: false },
    (err, response) => {
      if (err) return res.status(500).send(err);
      return res.send(response);
    },
  );
});

module.exports = router;
