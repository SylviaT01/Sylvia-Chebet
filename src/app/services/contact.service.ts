import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // EmailJS configuration
  private emailJsServiceId = 'service_6d0xoi8';
  private emailJsTemplateId = 'template_jsmehi1'; 
  private emailJsNotificationTemplateId = 'template_xge438p'; 
  private emailJsUserId = 'DuXzd3G2Wi8f_4grn'; 
  private emailJsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';
  
  // Your email address to receive notifications
  private portfolioOwnerEmail = 'sylviachebet03@gmail.com'; 

  constructor(private http: HttpClient) { }

  // Method to send email using EmailJS
  sendEmail(formData: ContactFormData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send both emails and combine their responses
    return forkJoin([
      this.sendAutoReply(formData, headers),
      this.sendNotification(formData, headers)
    ]).pipe(
      catchError(error => {
        console.error('Error sending emails:', error);
        throw error;
      })
    );
  }

  // Send auto-reply to the person who submitted the form
  private sendAutoReply(formData: ContactFormData, headers: HttpHeaders): Observable<any> {
    const payload = {
      service_id: this.emailJsServiceId,
      template_id: this.emailJsTemplateId,
      user_id: this.emailJsUserId,
      template_params: {
        name: formData.name,
        email: formData.email,
        title: formData.subject,
        message: formData.message
      }
    };

    return this.http.post(this.emailJsEndpoint, payload, { headers })
      .pipe(
        tap(() => console.log('Auto-reply sent successfully')),
        catchError(error => {
          if (error.status === 200) {
            console.log('Auto-reply sent successfully (status 200)');
            return of({ success: true });
          }
          throw error;
        })
      );
  }

  // Send notification to you (portfolio owner)
  private sendNotification(formData: ContactFormData, headers: HttpHeaders): Observable<any> {
    const payload = {
      service_id: this.emailJsServiceId,
      template_id: this.emailJsNotificationTemplateId, 
      user_id: this.emailJsUserId,
      template_params: {
        to_email: this.portfolioOwnerEmail,
        sender_name: formData.name,
        sender_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        contact_date: new Date().toLocaleString()
      }
    };

    return this.http.post(this.emailJsEndpoint, payload, { headers })
      .pipe(
        tap(() => console.log('Notification email sent successfully')),
        catchError(error => {
          if (error.status === 200) {
            console.log('Notification email sent successfully (status 200)');
            return of({ success: true });
          }
          throw error;
        })
      );
  }
}