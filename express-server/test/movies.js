let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../server');
let should = chai.should();
let { Movie } = require('../model/Movie');
const { populate } = require('../model/Movie');

chai.use(chaiHTTP);

describe('Movies', () => {
    
    before( done => {
        Movie.deleteMany({}, error=>{
            done();
        });
    });

    describe('Inicialization', ()=>{
        it('It should start with an empty database', done => {
            chai.request(server)
                .get('/api/movies')
                .end((error, response) => {
                    response.should.have.status(200);
					response.body.should.be.a('array');
					response.body.length.should.be.eql(0);
					done();
                })
        })

        it('It should populate the database if empty', done => {
            populate().then(()=>{
                chai.request(server)
                .get('/api/movies')
                .end((error, response) => {
                    response.should.have.status(200);
					response.body.should.be.a('array');
					response.body.length.should.be.gt(0);
					done();
                })
            });            
        });

        it('It should not populate the database if it is not empty', done => {
            chai.request(server)
                .get('/api/movies')
                .end( async (error, response) => {  
                    const itemsBefore = response.body.length;                  
                    populate().then(function(){
                        chai.request(server)
                            .get('/api/movies')
                            .end((error, response) => {                                
                                response.body.length.should.be.eq(itemsBefore);                            
                                done();
                            });
                    }.bind(itemsBefore));
                });                                
        });

    });

    describe('/GET /api/movies', ()=>{
        it('It should GET all the movies from the database with the required props', done=>{
            chai.request(server)
                .get('/api/movies')
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');                    
                    response.body.length.should.be.gt(0);
                    for(const movie of response.body){
                        movie.should.be.a('object');
                        movie.should.have.property('_id');
                        movie.should.have.property('title');
                        movie.should.have.property('genre');
                        movie.should.have.property('releaseDate');
                        movie.should.have.property('mainActors');
                        movie.should.have.property('plot');
                        movie.should.have.property('trailer');                        
                    }
					done();
                });
        });
    });

    describe('/POST /api/movies/', () => {
		it('It should POST a movie and return a 201 http response on success', (done) => {
			let movie = {
                "title": "Matrix",
                "genre": "Action, Drama, Fantasy, Thriller",
                "releaseDate": "01 Mar 1993",
                "mainActors": "Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon",
                "plot": "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
                "trailer": "https://www.youtube.com/watch?v=2KnZac176Hs",
                "poster": "https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg"
            };

			chai.request(server)
				.post('/api/movies/')
				.send(movie)
				.end((error, response) => {
					response.should.have.status(201);
					response.body.should.have.property('_id');
                    response.body.should.have.property('title');
                    response.body.should.have.property('genre');
                    response.body.should.have.property('releaseDate');
                    response.body.should.have.property('mainActors');
                    response.body.should.have.property('plot');
                    response.body.should.have.property('trailer');  
					done();
				});
        });
        
        it('It should return a 400 http response if the request body is not correct', (done) => {
			let movie = {
                "title": "Matrix",
                "genre": ["Action", "Drama", "Fantasy", "Thriller"],
                "releaseDate": "01 Mar 1993",
                "mainActors": "Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon",
                "plot": "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
                "trailer": "https://www.youtube.com/watch?v=2KnZac176Hs",
                "poster": "https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg"
            };

			chai.request(server)
				.post('/api/movies/')
				.send(movie)
				.end((error, response) => {
					response.should.have.status(400);					
					done();
				});
		});
	});

    after((done) => {
		Movie.deleteMany({}, (error) => {
			done();
		});
	});


});