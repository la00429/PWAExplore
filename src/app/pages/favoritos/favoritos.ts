import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './favoritos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './favoritos.css'
})
export class FavoritosComponent implements OnInit {
  favoritos: Character[] = [];
  idEditando: number | null = null;
  notaTemp: string = '';

  constructor(private apiService: RickMortyService) {}

  ngOnInit() {
    this.apiService.favoritos$.subscribe(data => {
      this.favoritos = data;
    });
  }

  // FUNCIONALIDAD 3: Editar Registro Local
  iniciarEdicion(p: Character) {
    this.idEditando = p.id;
    this.notaTemp = p.localNote || '';
  }

  async guardarEdicion(id: number) {
    await this.apiService.actualizarNotaLocal(id, this.notaTemp);
    this.idEditando = null;
  }

  cancelarEdicion() {
    this.idEditando = null;
  }

  // FUNCIONALIDAD 3: Eliminar Registro Local
  async eliminar(id: number) {
    if (confirm('¿Desea eliminar este personaje de sus registros locales?')) {
      await this.apiService.eliminarFavorito(id);
    }
  }
}
