import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

export interface IUser {
  name: string;
  age: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  activeUsers: IUser[] = [
    { name: 'Antonio', age: 22 },
    { name: 'Mario', age: 24 },
  ];
  inactiveUsers: IUser[] = [
    { name: 'Mario', age: 29 },
    { name: 'Alessandro', age: 27 },
  ];

  constructor() {}
}
