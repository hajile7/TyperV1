import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserTypingTestDTO } from '../models/user-typing-test-dto';
import { UserBigraphStatDTO } from '../models/user-bigraph-stat-dto';
import { KeyStatDTO } from '../models/key-stat-dto';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  url: string = "https://localhost:7192/";

  addTest(testDTO: UserTypingTestDTO) {
    return this.http.post<UserTypingTestDTO>(`${this.url}api/UserStats/tests`, testDTO);
  }

  postBigraphStats(bigraphStatsDTO: UserBigraphStatDTO[]) {
    return this.http.post<UserBigraphStatDTO>(`${this.url}api/UserStats/bigraphs`, bigraphStatsDTO);
  }

  postKeyStats(keyStats: KeyStatDTO[]) {
    return this.http.post<KeyStatDTO>(`${this.url}api/UserStats/keys`, keyStats);
  }



}
