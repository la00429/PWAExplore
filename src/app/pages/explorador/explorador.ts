import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-explorador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './explorador.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './explorador.css'
})
export class ExploradorComponent implements OnInit {
  personajes: Character[] = [];
  cargando: boolean = false;
  error: string = '';

  searchForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(50), Validators.pattern(/^[\p{L}\p{N}\s.'-]*$/u)]
    }),
    estado: new FormControl('', { nonNullable: true }),
    especie: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(40), Validators.pattern(/^[\p{L}\p{N}\s.'-]*$/u)]
    })
  });
  validationMessage = '';
  sanitizedQuery = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalItems: number = 0;

  // Vista en Tabla o Tarjetas
  vistaTabla: boolean = true;

  constructor(private apiService: RickMortyService) {}

  ngOnInit() {
    this.buscar();
  }

  buscar(page: number = 1) {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      this.validationMessage = 'Revisa los campos: usa únicamente letras, números, espacios, punto, apóstrofe o guion y respeta la longitud máxima.';
      return;
    }

    const nombre = this.sanitizeSearchTerm(this.searchForm.controls.nombre.value);
    const especie = this.sanitizeSearchTerm(this.searchForm.controls.especie.value);
    const estado = this.searchForm.controls.estado.value;
    this.searchForm.patchValue({ nombre, especie }, { emitEvent: false });
    this.sanitizedQuery = [nombre, estado, especie].filter(Boolean).join(' | ') || 'sin filtros';
    this.validationMessage = '';
    this.paginaActual = page;
    this.cargando = true;
    this.error = '';

    this.apiService.getPersonajes(nombre, estado, especie, page)
      .subscribe({
        next: (res) => {
          this.personajes = res.results;
          this.totalPaginas = res.info.pages;
          this.totalItems = res.info.count;
          this.cargando = false;
        },
        error: (err) => {
          this.personajes = [];
          this.totalPaginas = 1;
          this.totalItems = 0;
          this.error = 'No se encontraron personajes con los criterios de búsqueda especificados.';
          this.cargando = false;
        }
      });
  }

  limpiarFiltros() {
    this.searchForm.reset({ nombre: '', estado: '', especie: '' });
    this.sanitizedQuery = '';
    this.validationMessage = '';
    this.buscar(1);
  }

  private sanitizeSearchTerm(value: string): string {
    return value
      .replace(/[^\p{L}\p{N}\s.'-]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async toggleFavorito(p: Character) {
    if (this.esFav(p.id)) {
      await this.apiService.eliminarFavorito(p.id);
    } else {
      await this.apiService.guardarFavorito(p, 'Guardado desde la lista');
    }
  }

  esFav(id: number): boolean {
    return this.apiService.esFavorito(id);
  }
}
