import { Renderer2, ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Movie Catalog';
  movieList = [];
  private apiURL = 'http://localhost:3000/api';
  @ViewChild('autocompleteDiv') autocompleteDiv: ElementRef;

  movieForm = new FormGroup({
    title: new FormControl(''),
    genre: new FormControl(''),
    releaseDate: new FormControl(''),
    mainActors: new FormControl(''),
    plot: new FormControl(''),
    poster: new FormControl(''),
    trailer: new FormControl('')
  });

  movieDetailsForm = new FormGroup({
    _id: new FormControl(''),
    title: new FormControl(''),
    genre: new FormControl(''),
    releaseDate: new FormControl(''),
    mainActors: new FormControl(''),
    plot: new FormControl(''),
    poster: new FormControl(''),
    trailer: new FormControl('')
  });

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(){
    axios.get(this.apiURL + '/movies')
      .then((response) => {
        this.movieList = response.data;
        console.log(this.movieList);
      });
  }

  setDetailedMovie(movieIndex) {
    const m = this.movieList[movieIndex];
    this.movieDetailsForm.setValue({
      _id: m._id,
      title: m.title,
      genre: m.genre.join(', '),
      releaseDate: m.releaseDate.slice(0, 10),
      mainActors: m.mainActors.join(', '),
      plot: m.plot,
      poster: m.poster,
      trailer: m.trailer
    });
  }

  addMovie() {
    return axios.post(this.apiURL + '/movies', this.movieForm.value)
      .then( res => {
        if (res.status === 201) {
         this.getMovies();
        }
      });
  }

  saveMovie() {
    let movie = this.movieDetailsForm.value;
    movie.genre = movie.genre.split(',');
    movie.mainActors = movie.mainActors.split(',');
    return axios.put(this.apiURL + '/movies', movie)
      .then( res => {
        if (res.status === 200){
          this.getMovies();
        }
      });
  }

  searchOMDb(event: Event) {
    const title = event.target.value;
    if (title.length > 3){
      axios.get(`http://www.omdbapi.com/?apikey=72aabae2&s=${title}&type=movie`)
        .then(response => {
          if (response.data.Response === 'True') {
            const movies: [] = response.data.Search;
            this.renderer.setProperty(this.autocompleteDiv.nativeElement, 'innerHTML', '');
            movies.forEach((movie: any) => {
              const a = this.renderer.createElement('a');
              this.renderer.setAttribute(a, 'href', '#');
              this.renderer.setAttribute(a, 'data-movie', JSON.stringify(movie));
              this.renderer.addClass(a, 'dropdown-item');
              this.renderer.setProperty(a, 'innerHTML', movie.Title);
              this.renderer.listen(a, 'click', (evt) => { this.setDetailedMovie(evt); });
              this.renderer.appendChild(this.autocompleteDiv.nativeElement, a);
            });
            this.setFormMovie(movies[0]);
            this.renderer.setStyle(this.autocompleteDiv.nativeElement, 'display', 'block');
          } else {
            this.renderer.setStyle(this.autocompleteDiv.nativeElement, 'display', 'none');
          }
        });
    }
  }

  hideAutocomplete() {
    this.renderer.setStyle(this.autocompleteDiv.nativeElement, 'display', 'none');
  }

  setFormMovie(movie){
    axios.get(`http://www.omdbapi.com/?apikey=72aabae2&i=${movie.imdbID}`)
      .then( res => {
        const m = res.data;
        this.movieForm.setValue({
          title: m.Title,
          genre: m.Genre,
          releaseDate: new Date(m.Released).toISOString().slice(0, 10),
          mainActors: m.Actors,
          plot: m.Plot,
          poster: m.Poster,
          trailer: this.movieForm.value.trailer
        });
      });
  }
}
