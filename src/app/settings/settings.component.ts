import { inject, OnInit, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { RepositoryType } from 'services/backend-endpoints.constants';
import { InitializationService } from 'services/initialization-service/initialization-service';

/**
 * A component for setting configuration.
 */
@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
    ],
})
export class SettingsComponent implements OnInit {
    private initializationService = inject(InitializationService);
    repositoryTypeArray = Object.values(RepositoryType);
    private formBuilder = inject(FormBuilder);
    settingsForm = this.formBuilder.group({
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
        this.settingsForm.controls.repositoryTypeSelect.setValue(RepositoryType.WebStorage);// ????????????????
        console.log('SettingsComponent.ngOnInit():');
    }
    /**
     * Sets the repository type.
     *
     * @returns void
     */
    setRepositoryType(repositoryType: RepositoryType) {
        this.initializationService.setRepositoryType(repositoryType);
        console.log('SettingsComponent.selectRepositoryType(): repositoryType[%s]', repositoryType);
    }
    /**
     * Initialises the selected repository.
     *
     * @returns void
     */
    initialiseRepository() {
        this.initializationService.loadInitialData();
        console.log('SettingsComponent.initialiseRepository():');
    }

}
