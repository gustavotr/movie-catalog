const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server');

const should = chai.should();
const { Movie } = require('../model/Movie');
const { populate } = require('../model/Movie');

chai.use(chaiHTTP);

describe('Movies', () => {
  before((done) => {
    Movie.deleteMany({}, () => {
      done();
    });
  });

  describe('Inicialization', () => {
    it('It should start with an empty database', (done) => {
      chai.request(server)
        .get('/api/movies')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.eql(0);
          done();
        });
    });

    it('It should populate the database if empty', (done) => {
      populate().then(() => {
        chai.request(server)
          .get('/api/movies')
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.be.gt(0);
            done();
          });
      });
    });

    it('It should not populate the database if it is not empty', (done) => {
      chai.request(server)
        .get('/api/movies')
        .end(async (error, response) => {
          const itemsBefore = response.body.length;
          populate().then((() => {
            chai.request(server)
              .get('/api/movies')
              .end((e, res) => {
                res.body.length.should.be.eq(itemsBefore);
                done();
              });
          }));
        });
    });
  });

  describe('/POST /api/movies/', () => {
    it('It should POST a movie and return a 201 http response on success', (done) => {
      const movie = {
        title: 'Matrix',
        genre: 'Action, Drama, Fantasy, Thriller',
        releaseDate: '01 Mar 1993',
        mainActors: 'Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon',
        plot: "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
        trailer: 'https://www.youtube.com/watch?v=2KnZac176Hs',
        poster: 'https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg',
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
      const movie = {
        title: 'Matrix',
        genre: ['Action', 'Drama', 'Fantasy', 'Thriller'],
        releaseDate: '01 Mar 1993',
        mainActors: 'Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon',
        plot: "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
        trailer: 'https://www.youtube.com/watch?v=2KnZac176Hs',
        poster: 'https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg',
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

  describe('/GET /api/movies', () => {
    it('It should GET all the movies from the database with the required props', (done) => {
      chai.request(server)
        .get('/api/movies')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.gt(0);
          response.body.forEach((movie) => {
            movie.should.be.a('object');
            movie.should.have.property('_id');
            movie.should.have.property('title');
            movie.should.have.property('genre');
            movie.should.have.property('releaseDate');
            movie.should.have.property('mainActors');
            movie.should.have.property('plot');
            movie.should.have.property('trailer');
          });
          done();
        });
    });

    it('It should limit the number of movies returned in each request to 50', async () => {
      const movie = {
        title: 'Matrix',
        genre: 'Action, Drama, Fantasy, Thriller',
        releaseDate: '01 Mar 1993',
        mainActors: 'Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon',
        plot: "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
        trailer: 'https://www.youtube.com/watch?v=2KnZac176Hs',
        poster: 'https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg',
      };

      for (let i = 0; i < 60; i++) {
        await chai.request(server)
          .post('/api/movies/')
          .send(movie);
      }

      chai.request(server)
        .get('/api/movies')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.eq(50);
        });
    });

    it('It should GET the movies using LIMIT and OFFSET passed as parameters', (done) => {
      chai.request(server)
        .get('/api/movies?limit=10&offset=10')
        .end((error, response) => {
          response.body.length.should.be.eq(10);
          done();
        });
    });
  });

  describe('/PUT /api/movies/', () => {
    it('It should update the value of a movie', (done) => {
      const movie = {
        title: 'Matrix',
        genre: 'Action, Drama, Fantasy, Thriller',
        releaseDate: '01 Mar 1993',
        mainActors: 'Nick Mancuso, Phillip Jarrett, Carrie-Anne Moss, John Vernon',
        plot: "Steven Matrix is one of the underworld's foremost hitmen until his luck runs out, and someone puts a contract out on him. Shot in the forehead by a .22 pistol, Matrix \"dies\" and finds ...",
        trailer: 'https://www.youtube.com/watch?v=2KnZac176Hs',
        poster: 'https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlZS00MmQ5LWFmNjEtMjE5MTczN2RjNjE3XkEyXkFqcGdeQXVyNTc2ODIyMzY@._V1_SX300.jpg',
      };

      chai.request(server)
        .post('/api/movies/')
        .send(movie)
        .end((error, response) => {
          response.should.have.status(201);
          const updatedMovie = response.body;
          updatedMovie.genre.push('Generic');
          chai.request(server)
            .put('/api/movies')
            .send(updatedMovie)
            .end((e, r) => {
              r.should.have.status(200);
              r.body.genre.should.include('Generic');
              done();
            });
        });
    });
  });

  after((done) => {
    Movie.deleteMany({}, () => {
      done();
    });
  });
});
