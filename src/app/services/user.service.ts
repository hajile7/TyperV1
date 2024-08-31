import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  url: string = "https://localhost:7192/"

  activeUser = {} as UserModel;

  isLoggedIn: boolean = false;

  addUser(newUserForm: FormData): Observable<UserModel>{
    return this.http.post<UserModel>(`${this.url}api/User`, newUserForm);
  }

  updateUser(updateForm: FormData, userId: number): Observable<UserModel>{
    return this.http.put<UserModel>(`${this.url}api/User/${userId}`, updateForm);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.url}api/User/${userId}`);
  }

  login(username: string, password: string): Observable<UserModel>{
    return this.http.get<UserModel>(`${this.url}api/User/Login?username=${username}&password=${password}`);
  }

  logout() {
    this.activeUser = {} as UserModel;
    this.isLoggedIn = false;
    this.router.navigate(["/Home"]);
  }

}
