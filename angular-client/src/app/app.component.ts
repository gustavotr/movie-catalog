import { Renderer2, ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  @ViewChild('autocompleteDiv', {static: false}) autocompleteDiv: ElementRef;

  loggedIn: boolean = false;

  usersList = {
    admin: 'admin',
    gustavo: 'ovatsug',
    trudax: 'tech'
  };

  loginMessage = '';

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

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

  constructor(
    private renderer: Renderer2, 
    private el: ElementRef,
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(){
    this.http.get(this.apiURL + '/movies')
      .subscribe((response: []) => {        
        this.movieList = response;        
      });
  }

  performLogIn() {
    if (this.usersList[this.loginForm.value.username] === this.loginForm.value.password) {
      this.loggedIn = true;
      this.loginMessage = 'Loged In';
    } else {
      this.loginMessage = 'Username or Password is incorrect!';
    }
  }

  performLogOut() {
    this.loggedIn = false;
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
    return this.http.post(this.apiURL + '/movies', this.movieForm.value)
      .subscribe( response => {             
         this.getMovies();                
      });
  }

  saveMovie() {
    let movie = this.movieDetailsForm.value;
    movie.genre = movie.genre.split(',');
    movie.mainActors = movie.mainActors.split(',');
    return this.http.put(this.apiURL + '/movies', movie)      
      .subscribe( res => {
        this.getMovies();        
      });
  }

  searchOMDb(event: Event) {    
    const title = this.movieForm.value.title;
    if (title.length > 3){
      this.http.get<any>(`http://www.omdbapi.com/?apikey=72aabae2&s=${title}&type=movie`)        
        .subscribe(data => {
          if (data.Response === 'True') {            
            const movies = data.Search;
            this.renderer.setProperty(this.autocompleteDiv.nativeElement, 'innerHTML', '');
            movies.forEach((movie: any) => {
              console.log(movie)
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
    this.http.get(`http://www.omdbapi.com/?apikey=72aabae2&i=${movie.imdbID}`)    
      .subscribe( data => {
        const m: any = data;
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
