import { Routes } from '@angular/router';
import { ExploradorComponent } from './pages/explorador/explorador';
import { DetalleComponent } from './pages/detalle/detalle';
import { FavoritosComponent } from './pages/favoritos/favoritos';

export const routes: Routes = [
  { path: 'explorador', component: ExploradorComponent },
  { path: 'detalle/:id', component: DetalleComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: '', redirectTo: 'explorador', pathMatch: 'full' },
  { path: '**', redirectTo: 'explorador' }
];
