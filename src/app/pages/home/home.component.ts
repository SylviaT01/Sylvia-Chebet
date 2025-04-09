import { Component } from '@angular/core';
const Sylvia = 'assets/images/Sylvia.jpg';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public imageSrc = Sylvia;
}
