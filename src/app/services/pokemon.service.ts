import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to load Pokémon', error);
          return throwError(
            () => new Error('Unable to load Pokémon data. Please try again.')
          );
        })
      );
  }
}

