const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Seed = require('./MovieSeeds.json');

const Movie = new mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  genre: {
    type: [String],
    default: undefined,
  },
  releaseDate: {
    type: Date,
  },
  mainActors: {
    type: [String],
    default: undefined,
  },
  plot: {
    type: String,
  },
  trailer: {
    type: String,
  },
  poster: {
    type: String,
  },
}));

const validate = (movie) => {
  const schema = {
    title: Joi.string().max(100).required(),
    genre: Joi.string(),
    releaseDate: Joi.string(),
    mainActors: Joi.string(),
    plot: Joi.string(),
    trailer: Joi.string(),
    poster: Joi.string(),
  };

  return Joi.validate(movie, schema);
};

const populate = async () => {
  // check if the database is empty
  const moviesCount = await Movie.countDocuments();
  if (moviesCount === 0) { // if it if populate the database with the seeds
    Seed.movieSeeds.map((m) => {
      const movie = new Movie(m);
      movie.save()
        .catch(err => console.error('Error:', err));
      return null;
    });
  }
};
const parse = (stringObj) => {
  const movie = {
    title: stringObj.title,
    genre: stringObj.genre.split(',').map(e => e.trim()),
    releaseDate: stringObj.releaseDate,
    mainActors: stringObj.mainActors.split(',').map(e => e.trim()),
    plot: stringObj.plot,
    trailer: stringObj.trailer,
    poster: stringObj.poster,
  };
  return movie;
};

module.exports = {
  Movie,
  validate,
  populate,
  parse,
};
