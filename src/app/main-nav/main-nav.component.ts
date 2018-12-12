import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  private authDataSub: Subscription;
  userIsAuthenticated = false;
  nickname = '-.-';
  gender = '-.-';
  startWeight = '-.-';
  goalWeight = '-.-';
  innerWidth: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));



  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.innerWidth = window.innerWidth <= 767;
    this.startWeight = this.authService.getStartWeight();
    this.gender = this.authService.getGender();
    this.nickname = this.authService.getUserName();
    this.goalWeight = this.authService.getGoal();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.authDataSub = this.authService.authDataChanged.subscribe(authData => {
      this.startWeight = authData.startWeight;
      this.gender = authData.gender;
      this.nickname = authData.nickname;
      this.goalWeight = authData.goalWeight;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.authDataSub.unsubscribe();
  }
}
