import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { JwtService } from '../auth/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService:StorageService,private jwtService:JwtService) { }
  hasRole(requiredRoles: string[]): boolean {
    const accessToken = this.storageService.accessToken;
    if (!accessToken) {
      return false;
    }
    const decodedToken = this.jwtService.decodeToken(accessToken);
    if (!decodedToken || !decodedToken.roles) {
      return false;
    }
    const userRoles = Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles];
    return requiredRoles.some(role => userRoles.includes(role));
  }

  isAuthenticated(): boolean {
    return this.storageService.hasAccessToken();
  }

}
