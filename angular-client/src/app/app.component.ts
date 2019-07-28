import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Movie Catalog';
  detailedMovie = {};
  movieList = [];
  private apiURL = 'http://localhost:3000/api';

  ngOnInit(): void {
    axios.get(this.apiURL + '/movies')
      .then((response) => {
        this.movieList = response.data;
        console.log(this.movieList);
      });
  }

  addMovie(): boolean {
    return true;
  }
}
