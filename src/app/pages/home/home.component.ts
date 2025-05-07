import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ContactService } from '../../services/contact.service';
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

  contactForm: FormGroup;
  formSubmitted = false;
  formError = false;
  formSuccess = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
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

  onSubmit() {
    this.formSubmitted = true;
    
    // Stop here if form is invalid
    if (this.contactForm.invalid) {
      this.formError = true;
      setTimeout(() => {
        this.formError = false;
      }, 3000);
      return;
    }
    
    this.isSubmitting = true;
    
    this.contactService.sendEmail(this.contactForm.value)
      .subscribe({
        next: () => {
          this.formSuccess = true;
          this.formSubmitted = false;
          this.contactForm.reset();
          this.isSubmitting = false;
          setTimeout(() => {
            this.formSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.formError = true;
          this.isSubmitting = false;
          setTimeout(() => {
            this.formError = false;
          }, 3000);
        }
      });
  }
}
