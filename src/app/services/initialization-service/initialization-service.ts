import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RepositoryType, ENDPOINTS } from 'services/backend-endpoints.constants';
import { BACKEND_INITIAL_DATA } from 'services/backend-initial-data';
import { Department } from 'models/department';

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
  setRepositoryType(repositoryType: RepositoryType) {
    this.storage.setItem('repositoryType', repositoryType);
    console.log('InitializationService.setRepositoryType(): repositoryType[%s]', repositoryType);
  }
  /**
   * Loads initial data.
   * @param repositoryType 
   */
  loadInitialData() {

    const json = this.storage.getItem('departments') ?? '';
    const departments = JSON.parse(json) as Department[];
    console.log('############################## departments from S-T-O-R-A-G-E');
    console.log(JSON.stringify(departments));
    console.log('##############################');

    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if(RepositoryType.WebStorage === repositoryType ) {
      console.log('InitializationService.loadInitialData(): no loading for RepositoryType WebStorage');
      return;
    }
    this.http.post(ENDPOINTS.loadInitialData(repositoryType), BACKEND_INITIAL_DATA).subscribe(
      {
        next: () => {
          console.log('InitializationService.loadInitialData(): repositoryType[%s]', repositoryType);
        },
        error: err => {
          console.log('Error occurred while loading initial data:', err);
        }
      }
    );
  }
}
