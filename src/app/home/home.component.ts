import { Component, InjectionToken, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { InitializationService } from 'services/initialization-service/initialization-service';
import { RepositoryType } from 'home/repository-type';
import { INITIAL_DATA } from './initial-data';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * A component for home page.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
  ],
})
export class HomeComponent implements OnInit {
  storage = inject<Storage>(BROWSER_STORAGE);
  private initializationService = inject(InitializationService);
  repositoryTypeArray = Object.values(RepositoryType);
  private formBuilder = inject(FormBuilder);
  homeForm = this.formBuilder.group({
    repositoryTypeSelect: RepositoryType.WebStorage,
  });
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    let repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (!repositoryType) {
      repositoryType = RepositoryType.WebStorage;
      this.storage.setItem('repositoryType', repositoryType);
      this.storage.setItem('departments', JSON.stringify(INITIAL_DATA.departments));
    }
    this.homeForm.controls.repositoryTypeSelect.setValue(repositoryType);
    if (repositoryType !== RepositoryType.WebStorage) {
      this.initializationService.loadDepartmentsFromBackend();
    }
    console.log('🟧HomeComponent.ngOnInit(): repositoryType[%s]', repositoryType);
  }
  /**
   * Sets the repository type.
   *
   * @param repositoryType 
   * @returns void
   */
  setRepositoryType(repositoryType: RepositoryType) {
    this.storage.setItem('repositoryType', repositoryType);
    if (repositoryType !== RepositoryType.WebStorage) {
      this.initializationService.loadDepartmentsFromBackend();
    }
    console.log('🟧HomeComponent.selectRepositoryType(): repositoryType[%s]', repositoryType);
  }
  /**
   * Initialises the selected repository.
   *
   * @returns void
   */
  initialiseRepository() {
    this.storage.setItem('departments', JSON.stringify(INITIAL_DATA.departments));
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (RepositoryType.WebStorage !== repositoryType) {
      this.initializationService.postInitialDataToBackend();
    }
    console.log('🟧HomeComponent.initialiseRepository(): repositoryType[%s]', repositoryType);
  }
  /**
   * Describes the repository type.
   *
   * @param repositoryType 
   * @returns void
   */
  describeRepositoryType(repositoryType: RepositoryType) {
    switch (repositoryType) {
      case RepositoryType.PostgreSQL:
        return 'PostgreSQL database';
      case RepositoryType.MongoDB:
        return 'MongoDB database';
      case RepositoryType.MySQL:
        return 'MySQL database';
      default: //RepositoryType.WebStorage:
        return 'Only local web storage';
    }
  }
}
