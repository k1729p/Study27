import { ChangeDetectionStrategy, Component, InjectionToken, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { InitializationService } from 'services/initialization-service/initialization.service';
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
 * Dialog displaying error message.
 */
@Component({
  template: `<h2 mat-dialog-title>Error</h2>
    <mat-dialog-content>
      <p>Backend server failed</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close>OK</button>
    </mat-dialog-actions>`,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorMesssageDialog { }
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
  dialog: MatDialog = inject(MatDialog);
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
      this.initializationService.loadDepartmentsFromBackend(() => this.showBackendErrorDialog());
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
      this.initializationService.loadDepartmentsFromBackend(() => this.showBackendErrorDialog());
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
      this.initializationService.postInitialDataToBackend(() => this.showBackendErrorDialog());
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
      default: //RepositoryType.WebStorage:
        return 'Only local web storage';
    }
  }
  /**
   * Opens the error dialog when backend server fails.
   */
  private showBackendErrorDialog() {
    this.dialog.open(ErrorMesssageDialog, { width: '250px' });
  }

}
