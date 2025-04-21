import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  hasAccessToken(): boolean {
    return this.accessToken !== null;
  }
  setAccessToken(token: string): void {
    localStorage.setItem(environment.storageKey, token);
  }

  get accessToken(): string | null {
    return localStorage.getItem(environment.storageKey);  // Получаем токен
  }

  removeAccessToken(): void {
    localStorage.removeItem(environment.storageKey);  // Удаляем токен
  }
}

