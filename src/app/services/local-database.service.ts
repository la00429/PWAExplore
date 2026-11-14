import { Injectable } from '@angular/core';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalDatabaseService {
  private readonly databaseName = 'pwa-explorador-db';
  private readonly databaseVersion = 1;
  private readonly storeName = 'favoritos';

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB no está disponible en este navegador.'));
        return;
      }

      const request = window.indexedDB.open(this.databaseName, this.databaseVersion);

      request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB.'));
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async getAll(): Promise<Character[]> {
    const database = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readonly');
      const request = transaction.objectStore(this.storeName).getAll();
      request.onerror = () => reject(request.error ?? new Error('No se pudieron leer los favoritos.'));
      request.onsuccess = () => resolve(request.result as Character[]);
      transaction.oncomplete = () => database.close();
    });
  }

  async put(character: Character): Promise<void> {
    const database = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      transaction.objectStore(this.storeName).put(character);
      transaction.onerror = () => reject(transaction.error ?? new Error('No se pudo guardar el favorito.'));
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
    });
  }

  async delete(id: number): Promise<void> {
    const database = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      transaction.objectStore(this.storeName).delete(id);
      transaction.onerror = () => reject(transaction.error ?? new Error('No se pudo eliminar el favorito.'));
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
    });
  }
}
