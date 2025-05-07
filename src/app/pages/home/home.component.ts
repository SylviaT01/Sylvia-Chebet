import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
const Sylvia = 'assets/images/Sylvia-profile.png';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit, AfterViewInit {
  public imageSrc = Sylvia;
  private isBrowser: boolean;
  private AOS: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      import('aos').then(AOS => {
        this.AOS = AOS;
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: false
        });

        this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(() => {
            setTimeout(() => AOS.refreshHard(), 100);
          });

        setTimeout(() => {
          this.AOS.refreshHard();
        }, 200);
      });
    }
  }
}
