import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RepositoryType } from 'home/repository-type';
import { ENDPOINTS } from 'services/backend-endpoints.constants';

/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for initializing repositories.
 */
@Injectable({
  providedIn: 'root',
})
export class InitializationService {
  storage = inject<Storage>(BROWSER_STORAGE);
  private http = inject(HttpClient);
  /**
   * Loads initial data.
   * @param repositoryType 
   */
  loadInitialData() {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    const json = this.storage.getItem('departments') ?? '';
    this.http.post(ENDPOINTS.loadInitialData(repositoryType), json).subscribe({
      next: () => {
        console.log('InitializationService.loadInitialData(): repositoryType[%s]', repositoryType);
      },
      error: err => {
        console.log('InitializationService.loadInitialData(): error ', err);
      }
    });
  }
}
