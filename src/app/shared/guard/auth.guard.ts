import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '@service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private authService: AuthService, private router: Router) {}

  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if(!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}
