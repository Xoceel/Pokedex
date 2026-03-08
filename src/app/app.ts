import { Component, signal } from '@angular/core';
import { PokedexComponent } from './pokedex/pokedex.component';

@Component({
  selector: 'app-root',
  imports: [PokedexComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-pokedex');
}
