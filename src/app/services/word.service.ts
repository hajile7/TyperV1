import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private http: HttpClient, private router: Router) { }

  url: string = "https://localhost:7192/"

  getRandomWordArr(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}api/Words/Random`);
  }


}
