import { InjectionToken, inject, OnInit, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';

import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';
import { InitializationService } from 'services/initialization-service/initialization-service';
import { RepositoryType } from 'home/repository-type';
import { BACKEND_INITIAL_DATA } from './backend-initial-data';

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
  private departmentService: DepartmentService = inject(DepartmentService);

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
      this.storage.setItem('departments', JSON.stringify(BACKEND_INITIAL_DATA.departments));
    }
    this.homeForm.controls.repositoryTypeSelect.setValue(repositoryType);
    this.selectActiveRepository(repositoryType);
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
    this.selectActiveRepository(repositoryType);
    console.log('🟧HomeComponent.selectRepositoryType(): repositoryType[%s]', repositoryType);
  }
  /**
   * Initialises the selected repository.
   *
   * @returns void
   */
  initialiseRepository() {
    this.storage.setItem('departments', JSON.stringify(BACKEND_INITIAL_DATA.departments));
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (RepositoryType.WebStorage !== repositoryType) {
      this.initializationService.loadInitialData();
    }
    console.log('🟧HomeComponent.initialiseRepository(): repositoryType[%s]', repositoryType);
  }

  /**
   * Selects the repository used in application.
   *
   * @param repositoryType 
   * @returns void
   */
  private selectActiveRepository(repositoryType: RepositoryType) {
    if (repositoryType === RepositoryType.WebStorage) {
      return;
    }
    const departments$: Observable<Department[] | undefined> = this.departmentService.getDepartmentsFromBackend();
    departments$.subscribe(departments => {
      this.storage.setItem('departments', JSON.stringify(departments));

      console.log("❤️❤️❤️ Datasource Converter - departments array size: " + departments?.length);


    });
  }

}
