import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`
  private user = new BehaviorSubject<User | null>(null);

  user$ = this.user.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, { email, password})
      .pipe(
        tap(res => this.tokenService.saveToken(res.access_token))
      )
  }

  getProfile() {
    //let headers = new HttpHeaders();
    //headers = headers.set('Authorization', `Bearer ${token}`)
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          this.user.next(user)
        })
      )
 }

 loginAndGetProfile(email: string, password: string) {
  return this.login(email, password).pipe(
    switchMap(token => this.getProfile())
  )
 }

 logout() {
  this.tokenService.removeToken();
 }

}
