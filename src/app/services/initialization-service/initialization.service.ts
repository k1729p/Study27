import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Department } from 'models/department';
import { RepositoryType } from 'home/repository-type';
import { ENDPOINTS } from 'services/backend-endpoints.constants';
import { INITIAL_DATA } from 'home/initial-data';
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
   * Posts initial data to the backend server.
   */
  postInitialDataToBackend(onError?: (err: unknown) => void) {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    this.http.post(ENDPOINTS.loadInitialData(repositoryType), INITIAL_DATA).subscribe({
      next: () => {
        console.log('InitializationService.postInitialDataToBackend(): repositoryType[%s]', repositoryType);
      },
      error: err => {
        console.log('InitializationService.postInitialDataToBackend(): error ', err);
        if (onError) onError(err);
      }
    });
  }
  /**
   * Loads the department array from the backend server.
   */
  loadDepartmentsFromBackend(onError?: (err: unknown) => void) {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    this.http.get<Department[]>(ENDPOINTS.getDepartments(repositoryType))
      .subscribe({
        next: departments => {
          this.storage.setItem('departments', JSON.stringify(departments));
          console.log('InitializationService.loadDepartmentsFromBackend(): repositoryType[%s]',
            repositoryType);
        },
        error: err => {
          this.storage.setItem('departments', JSON.stringify([]));
          console.log('InitializationService.loadDepartmentsFromBackend(): error[%s]', err);
          if (onError) onError(err);
        }
      });
  }
}
