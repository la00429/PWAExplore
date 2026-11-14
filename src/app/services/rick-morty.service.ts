import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiResponse, Character } from '../interfaces/character.interface';
import { LocalDatabaseService } from './local-database.service';

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private LOCAL_STORAGE_KEY = 'pwa_favoritos_personajes';

  private favoritosSubject = new BehaviorSubject<Character[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localDatabase: LocalDatabaseService
  ) {
    void this.cargarFavoritos();
  }

  // Funcionalidad 1 y 2: Búsqueda y filtrado consumiendo la API
  getPersonajes(nombre: string = '', estado: string = '', especie: string = '', page: number = 1): Observable<ApiResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (nombre.trim()) params = params.set('name', nombre.trim());
    if (estado.trim()) params = params.set('status', estado.trim());
    if (especie.trim()) params = params.set('species', especie.trim());

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  getPersonajePorId(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  // Funcionalidad 3: Leer favoritos desde IndexedDB.
  getFavoritosLocales(): Character[] {
    return this.favoritosSubject.value;
  }

  async guardarFavorito(personaje: Character, nota: string = ''): Promise<void> {
    const favs = [...this.getFavoritosLocales()];
    const index = favs.findIndex(f => f.id === personaje.id);
    const itemGuardar: Character = {
      ...personaje,
      localNote: nota,
      savedAt: new Date().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    if (index >= 0) {
      favs[index] = itemGuardar;
    } else {
      favs.push(itemGuardar);
    }

    await this.localDatabase.put(itemGuardar);
    this.favoritosSubject.next(favs);
  }

  // Funcionalidad 3: Modificar nota local con Promise.
  async actualizarNotaLocal(id: number, nuevaNota: string): Promise<void> {
    const favs = [...this.getFavoritosLocales()];
    const personaje = favs.find(f => f.id === id);
    if (personaje) {
      personaje.localNote = nuevaNota;
      await this.localDatabase.put(personaje);
      this.favoritosSubject.next(favs);
    }
  }

  // Funcionalidad 3: Eliminar registro local con Promise.
  async eliminarFavorito(id: number): Promise<void> {
    const favs = this.getFavoritosLocales().filter(f => f.id !== id);
    await this.localDatabase.delete(id);
    this.favoritosSubject.next(favs);
  }

  esFavorito(id: number): boolean {
    return this.getFavoritosLocales().some(f => f.id === id);
  }

  private async cargarFavoritos(): Promise<void> {
    try {
      let favoritos = await this.localDatabase.getAll();
      if (favoritos.length === 0) {
        favoritos = this.migrarFavoritosDesdeLocalStorage();
        await Promise.all(favoritos.map(favorito => this.localDatabase.put(favorito)));
        if (favoritos.length > 0) {
          localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        }
      }
      this.favoritosSubject.next(favoritos);
    } catch (error) {
      console.error('No se pudieron cargar los favoritos desde IndexedDB.', error);
    }
  }

  private migrarFavoritosDesdeLocalStorage(): Character[] {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data) as Character[];
    } catch (error) {
      console.error('No se pudieron migrar los favoritos anteriores.', error);
      return [];
    }
  }
}
