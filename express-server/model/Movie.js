const mongoose = require('mongoose');
// const Joi = require('@hapi/joi');
const Seed = require('./MovieSeeds.json');

const Movie = new mongoose.model('Movie', new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxlength: 100
    },
    genre:{
        type: [String],
        default: undefined
    },
    releaseDate:{
        type: Date
    },
    mainActors:{
        type: [String],
        default: undefined
    },
    plot:{
        type: String
    },
    trailer:{
        type: String
    },
    poster:{
        type: String
    }
}));

// const validate = (movie) => {
// 	const schema = {
//         title: Joi.string().max(100).required(),
//         genre: Join.array().items(Joi.string()),
//         releaseDate: Joi.date().iso(),
//         mainActors: Joi.array().items(Joi.string()),
//         plot: Joi.string(),
//         trailer: Joi.string().uri({
//             scheme: [
//               'http',
//               'https'
//             ]
//           }),
//         poster: Joi.string().uri(),
// 	};

// 	return (Joi.validate(movie, schema));
// };
 
const populate = async () =>{ 
    // check if the database is empty
    const moviesCount = await Movie.count();
    if(moviesCount == 0 ){ //if it if populate the database with the seeds
        for(const m of Seed.movieSeeds){
            let movie = new Movie(m);
            movie.save()
                .then(()=> console.log("Movie added!"))
                .catch( (err) => console.log('Error:', err));
        }
    }
}

module.exports = {
	Movie,
    // validate,
    populate
};