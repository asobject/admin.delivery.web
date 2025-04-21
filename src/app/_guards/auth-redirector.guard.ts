import { inject } from '@angular/core';
import {CanActivateFn, Router,} from '@angular/router';
import { UserService } from '../_services/user/user.service';

export const AuthRedirectorGuard : CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const isAuthenticated = userService.isAuthenticated();
  return isAuthenticated
    ? router.parseUrl('/home')
    : router.parseUrl('/login');
};
