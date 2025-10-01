import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';

/**
 * DepartmentFormComponent is an Angular component that provides a form for creating, updating, or deleting a department.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 */
@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentFormComponent implements OnInit {
  public departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  departmentForm = this.formBuilder.group({
    name: ['', Validators.required],
    notes: [''],
    startDate: new Date(),
    endDate: new Date(),
    image: [''],
  });
  operation = '';
  formTitle = '';
  buttonLabel = '';
  id = '';
  keywordsSignal = signal(['']);
  readonly currentKeyword = model('');
  readonly suggestionKeywords: string[] = [
    'Banking',
    'Credit',
    'Insurance',
    'Finance',
    'Corporate',
    'Personal',
    'Public',
    'Stock Market',
    'Foreign Exchange',
    'Fintech',
  ];
  readonly filteredKeywords = computed(() => {
    const currentKeyword = this.currentKeyword().toLowerCase();
    return currentKeyword
      ? this.suggestionKeywords.filter((keyword) =>
        keyword.toLowerCase().includes(currentKeyword)
      )
      : this.suggestionKeywords.slice();
  });
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.operation = this.route.snapshot.paramMap.get('operation') ?? '';
    if (this.operation === 'CREATE') {
      this.formTitle = 'Create Department';
      this.buttonLabel = 'Create';
    } else if (this.operation === 'READ') {
      this.formTitle = 'Read Department';
      this.buttonLabel = 'Read';
    } else if (this.operation === 'UPDATE') {
      this.formTitle = 'Update Department';
      this.buttonLabel = 'Update';
    } else if (this.operation === 'DELETE') {
      this.formTitle = 'Delete Department';
      this.buttonLabel = 'Delete';
    }
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const department = this.departmentService.getDepartment(+this.id);
    this.departmentForm.controls.name.setValue(department?.name ?? '');
    this.departmentForm.controls.startDate.setValue(
      department?.startDate ?? null
    );
    this.departmentForm.controls.endDate.setValue(department?.endDate ?? null);
    this.departmentForm.controls.notes.setValue(department?.notes ?? '');
    this.keywordsSignal = signal(department?.keywords ?? []);
    this.departmentForm.controls.image.setValue(
      department?.image ?? 'images/CommercialBuildingDefault.jpg'
    );
    console.log('🟢DepartmentFormComponent.ngOnInit():');
  }
  /**
   * The submit action handler.
   * It creates, updates, or deletes a department based on the operation type.
   */
  onSubmit() {
    if (this.operation === 'CREATE') {
      const department: Department = {
        id: -1,
        name: this.departmentForm.get('name')?.value ?? '',
        employees: [],
        startDate: this.departmentForm.get('startDate')?.value ?? undefined,
        endDate: this.departmentForm.get('endDate')?.value ?? undefined,
        notes: this.departmentForm.get('notes')?.value ?? '',
        keywords: this.keywordsSignal(),
      };
      this.departmentService.createDepartment(department);
      console.log(
        '🟢DepartmentFormComponent.onSubmit(): CREATE, name[%s]',
        department?.name
      );
    } else if (this.operation === 'READ') {
      const department = this.departmentService.getDepartment(+this.id);
      console.log(
        '🟢DepartmentFormComponent.onSubmit(): READ, id[%d], name[%s]',
        this.id,
        department?.name
      );
    } else if (this.operation === 'UPDATE') {
      const department: Department = {
        id: +this.id,
        name: this.departmentForm.get('name')?.value ?? '',
        employees: [],
        startDate: this.departmentForm.get('startDate')?.value ?? undefined,
        endDate: this.departmentForm.get('endDate')?.value ?? undefined,
        notes: this.departmentForm.get('notes')?.value ?? '',
        keywords: this.keywordsSignal(),
      };
      this.departmentService.updateDepartment(department);
      console.log(
        '🟢DepartmentFormComponent.onSubmit(): UPDATE, id[%d], name[%s]',
        this.id,
        department?.name
      );
    } else if (this.operation === 'DELETE') {
      this.departmentService.deleteDepartment(+this.id);
      console.log('🟢DepartmentFormComponent.onSubmit(): DELETE, id[%s]', this.id);
    }
    this.router.navigate(['/department-table'], { relativeTo: this.route });
  }
  /**
   * The cancel action handler.
   * It resets the form and navigates back to the department table.
   */
  onCancel() {
    this.departmentForm.reset();
    console.log('🟢DepartmentFormComponent.onCancel():');
    this.router.navigate(['/department-table'], { relativeTo: this.route });
  }
  /**
   * A filter function for the datepicker to only allow workdays (Monday to Friday).
   * This function prevents Saturday and Sunday from being selected.
   */
  workdaysFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDay();
    return day !== 0 && day !== 6;
  };
  /**
   * Adds a keyword from the input field.
   * This method updates the keywords array by adding the input value if it is not empty.
   *
   * @param event the MatChipInputEvent containing the input value
   */
  addKeyword(event: MatChipInputEvent): void {
    const keyword = (event.value || '').trim();
    this.keywordsSignal.update((keywordArray): string[] =>
      this.updateKeyword(keywordArray, keyword)
    );
    this.currentKeyword.set('');
  }
  /**
   * Removes a keyword from the list.
   * This method updates the keywords array by removing the specified keyword if it exists.
   *
   * @param keyword the keyword to remove
   */
  removeKeyword(keyword: string): void {
    this.keywordsSignal.update((keywordArray) => {
      const index = keywordArray.indexOf(keyword);
      if (index < 0) {
        return keywordArray;
      }
      keywordArray.splice(index, 1);
      return [...keywordArray];
    });
  }
  /**
   * Adds a selected keyword from the autocomplete dropdown.
   * This method updates the keywords array with the selected keyword
   * and clears the current keyword input.
   *
   * @param event the MatAutocompleteSelectedEvent containing the selected option
   */
  addSelectedKeyword(event: MatAutocompleteSelectedEvent): void {
    const keyword = event.option.viewValue;
    this.keywordsSignal.update((keywordArray): string[] =>
      this.updateKeyword(keywordArray, keyword)
    );
    this.currentKeyword.set('');
    event.option.deselect();
  }
  /**
   * Updates the keyword array by adding a new keyword if it does not already exist.
   * This method ensures that duplicate keywords are not added to the array.
   *
   * @param keywordArray the current array of keywords
   * @param keyword the keyword to add if it does not already exist
   * @return a new array with the keyword added if it was not already present
   */
  private updateKeyword(keywordArray: string[], keyword: string): string[] {
    if (keyword && keywordArray.indexOf(keyword) < 0) {
      return [...keywordArray, keyword];
    }
    return keywordArray;
  }
}
