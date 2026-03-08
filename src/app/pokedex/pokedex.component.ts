import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NgIf, NgFor, NgClass, DecimalPipe } from '@angular/common';
import { Pokemon } from '../models/pokemon';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DecimalPipe],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
})
export class PokedexComponent {
  private readonly pokemonService = inject(PokemonService);

  readonly minId = 1;
  readonly maxId = 151;

  currentId = signal<number>(1);
  pokemon = signal<Pokemon | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  readonly displayName = computed(() => {
    const p = this.pokemon();
    if (!p) return '';
    return p.name.charAt(0).toUpperCase() + p.name.slice(1);
  });

  constructor() {
    effect(() => {
      const id = this.currentId();
      this.loadPokemon(id);
    });
  }

  loadPokemon(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonById(id).subscribe({
      next: (p) => {
        this.pokemon.set(p);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Something went wrong.');
        this.loading.set(false);
      },
    });
  }

  previous(): void {
    if (this.currentId() > this.minId) {
      this.currentId.update((id) => id - 1);
    }
  }

  next(): void {
    if (this.currentId() < this.maxId) {
      this.currentId.update((id) => id + 1);
    }
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.previous();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  // Simple swipe detection on the main card container
  private swipeStartX: number | null = null;

  onPointerDown(event: PointerEvent): void {
    this.swipeStartX = event.clientX;
  }

  onPointerUp(event: PointerEvent): void {
    if (this.swipeStartX === null) return;
    const deltaX = event.clientX - this.swipeStartX;
    const threshold = 40;

    if (deltaX > threshold) {
      this.previous();
    } else if (deltaX < -threshold) {
      this.next();
    }

    this.swipeStartX = null;
  }

  isPreviousDisabled(): boolean {
    return this.currentId() <= this.minId || this.loading();
  }

  isNextDisabled(): boolean {
    return this.currentId() >= this.maxId || this.loading();
  }
}

