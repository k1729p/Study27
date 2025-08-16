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
    repositoryType = RepositoryType.PostgreSQL;
    repositoryTypeArray = Object.values(RepositoryType);
    private formBuilder = inject(FormBuilder);
    settingsForm = this.formBuilder.group({
        repositoryTypeSelect: this.repositoryType,
    });

    /**
     * A component lifecycle hook method.
     * Runs once after Angular has initialized all the component's inputs.
     *
     * https://angular.dev/guide/components/lifecycle#ngoninit
     * @returns void
     */
    ngOnInit() {
        this.settingsForm.controls.repositoryTypeSelect.setValue(this.repositoryType);
        console.log('SettingsComponent.ngOnInit():');
    }
    /**
     * Gets the repository type.
     *
     * @returns void
     */
    getRepositoryType() {
        console.log('SettingsComponent.getRepositoryType(): repositoryType[%s]', this.repositoryType);
        return this.repositoryType;
    }
    /**
     * Selects the repository type.
     *
     * @returns void
     */
    selectRepositoryType(repositoryType: RepositoryType) {
        this.repositoryType = repositoryType;
        console.log('SettingsComponent.selectRepositoryType(): repositoryType[%s]', this.repositoryType);
    }
    /**
     * Initialises the selected repository.
     *
     * @returns void
     */
    initialiseRepository() {
        this.initializationService.loadInitialData(this.repositoryType);
        console.log('SettingsComponent.initialiseRepository(): repositoryType[%s]', this.repositoryType);
    }

}
