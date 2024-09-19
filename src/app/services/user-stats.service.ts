import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserTypingTestDTO } from '../models/user-typing-test-dto';
import { UserBigraphStatDTO } from '../models/user-bigraph-stat-dto';
import { KeyStatDTO } from '../models/key-stat-dto';
import { UserStatsDTO } from '../models/user-stats-dto';
import { Observable } from 'rxjs';
import { UserStats } from '../models/user-stats';
import { UserBigraphStat } from '../models/user-bigraph-stat';

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

  postStats(statDTO: UserStatsDTO) {
    return this.http.post<UserStatsDTO>(`${this.url}api/UserStats/stats`, statDTO);
  }

  getPreviousTests(userId: number): Observable<UserTypingTestDTO[]> {
    return this.http.get<UserTypingTestDTO[]>(`${this.url}api/UserStats/UserTests?userId=${userId}`);
  }

  getUserStats(userId: number): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.url}api/UserStats/UserStats?userId=${userId}`);
  }

  getKeyStats(userId: number): Observable<KeyStatDTO[]> {
    return this.http.get<KeyStatDTO[]>(`${this.url}api/UserStats/UserKeys?userId=${userId}`);
  }

  getBigraphStats(userId: number, key: string): Observable<UserBigraphStat[]> {
    return this.http.get<UserBigraphStat[]>(`${this.url}api/UserStats/UserSpecificBigraphs?userId=${userId}&key=${key}`)
  }



}
