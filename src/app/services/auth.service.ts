import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'https://api.vitaverde.com/auth'; 
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.cargarToken();
  }

  async cargarToken() {
    const { value } = await Preferences.get({ key: 'token_jwt' });
    if (value) {
      this.currentUserSubject.next(value);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login`, { username, password })
      .pipe(map(user => {
        if (user && user.token) {
          Preferences.set({ key: 'token_jwt', value: user.token });
          this.currentUserSubject.next(user.token);
        }
        return user;
      }));
  }

  async logout() {
    await Preferences.remove({ key: 'token_jwt' });
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.currentUserSubject.value;
  }
}