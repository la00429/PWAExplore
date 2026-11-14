import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './detalle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detalle.css'
})
export class DetalleComponent implements OnInit {
  personaje?: Character;
  cargando: boolean = true;
  notaLocal: string = '';
  esGuardado: boolean = false;
  mensajeExito: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: RickMortyService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/explorador']);
      return;
    }

    const id = Number(idParam);
    this.apiService.getPersonajePorId(id).subscribe({
      next: (data) => {
        this.personaje = data;
        this.cargando = false;
        
        // Verificar si existe en favoritos y cargar la nota
        const favs = this.apiService.getFavoritosLocales();
        const fav = favs.find(f => f.id === id);
        if (fav) {
          this.esGuardado = true;
          this.notaLocal = fav.localNote || '';
        }
      },
      error: () => {
        this.cargando = false;
        this.router.navigate(['/explorador']);
      }
    });
  }

  // FUNCIONALIDAD 3: Guardar / Editar Nota Local
  async guardarEnLocal() {
    if (!this.personaje) return;
    await this.apiService.guardarFavorito(this.personaje, this.notaLocal);
    this.esGuardado = true;
    this.mensajeExito = '¡Personaje y nota guardados en almacenamiento local!';
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  // FUNCIONALIDAD 3: Eliminar de Local
  async eliminarDeLocal() {
    if (!this.personaje) return;
    await this.apiService.eliminarFavorito(this.personaje.id);
    this.esGuardado = false;
    this.notaLocal = '';
    this.mensajeExito = 'Eliminado de almacenamiento local.';
    setTimeout(() => this.mensajeExito = '', 3000);
  }
}
