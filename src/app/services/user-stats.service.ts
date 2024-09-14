import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserTypingTestDTO } from '../models/user-typing-test-dto';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  url: string = "https://localhost:7192/";

  addTest(testDTO: UserTypingTestDTO) {
    return this.http.post<UserTypingTestDTO>(`${this.url}api/UserStats`, testDTO);
  }



}
