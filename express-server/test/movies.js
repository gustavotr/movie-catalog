let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
let { Movie } = require('../model/Movie');
const { populate } = require('../model/Movie');
const Seed = require('../model/MovieSeeds.json');

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

    });

    describe('/GET /api/movies', ()=>{
        it('It should GET all the movies from the database', done=>{
            chai.request(server)
                .get('/api/movies')
                .end((error, response) => {
                    response.should.have.status(200);
					response.body.should.be.a('array');
					response.body.length.should.be.gt(0);
					done();
                })
        })
    })

    after((done) => {
		Movie.deleteMany({}, (error) => {
			done();
		});
	});


});