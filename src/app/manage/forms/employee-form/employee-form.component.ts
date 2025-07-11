import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';

import { EmployeeService } from '../../../services/employee-service/employee.service';
import { Title } from '../../../models/title';
import { Employee } from '../../../models/employee';
/**
 * EmployeeFormComponent is an Angular component that provides a form for creating, updating, or deleting an employee.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 * This component is part of the forms module and is used to manage employee-related forms.
 */
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    ReactiveFormsModule,
  ],
})
export class EmployeeFormComponent implements OnInit {
  public employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  titles: Title[] = [Title.Manager, Title.Analyst, Title.Developer];
  employeeForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    title: [Title.Developer, Validators.required],
    phone: ['', Validators.required],
    mail: ['', [Validators.required, Validators.email]],
    streetName: '',
    houseNumber: '',
    postalCode: '',
    locality: '',
    province: '',
    country: '',
  });
  departmentId = '';
  operation = '';
  formTitle = '';
  buttonLabel = '';
  id = '';

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   */
  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('departmentId') ?? '';
    this.operation = this.route.snapshot.paramMap.get('operation') ?? '';
    if (this.operation === 'CREATE') {
      this.formTitle = 'Create Employee';
      this.buttonLabel = 'Create';
    } else if (this.operation === 'READ') {
      this.formTitle = 'Read Employee';
      this.buttonLabel = 'Read';
    } else if (this.operation === 'UPDATE') {
      this.formTitle = 'Update Employee';
      this.buttonLabel = 'Update';
    } else if (this.operation === 'DELETE') {
      this.formTitle = 'Delete Employee';
      this.buttonLabel = 'Delete';
    }
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const employee = this.employeeService.getEmployee(
      +this.departmentId,
      +this.id
    );
    this.employeeForm.controls.firstName.setValue(employee?.firstName ?? '');
    this.employeeForm.controls.lastName.setValue(employee?.lastName ?? '');
    this.employeeForm.controls.title.setValue(
      employee?.title ?? Title.Developer
    );
    this.employeeForm.controls.phone.setValue(employee?.phone ?? '');
    this.employeeForm.controls.mail.setValue(employee?.mail ?? '');
    this.employeeForm.controls.streetName.setValue(employee?.streetName ?? '');
    this.employeeForm.controls.houseNumber.setValue(
      employee?.houseNumber ?? ''
    );
    this.employeeForm.controls.postalCode.setValue(employee?.postalCode ?? '');
    this.employeeForm.controls.locality.setValue(employee?.locality ?? '');
    this.employeeForm.controls.province.setValue(employee?.province ?? '');
    this.employeeForm.controls.country.setValue(employee?.country ?? '');
  }

  /**
   * The submit action handler.
   * It creates, updates, or deletes an employee based on the operation type.
   */
  onSubmit() {
    if (this.operation === 'CREATE') {
      const employee: Employee = {
        id: -1,
        firstName: this.employeeForm.get('firstName')?.value ?? '',
        lastName: this.employeeForm.get('lastName')?.value ?? '',
        title: this.employeeForm.get('title')?.value ?? Title.Developer,
        phone: this.employeeForm.get('phone')?.value ?? '',
        mail: this.employeeForm.get('mail')?.value ?? '',
        streetName: this.employeeForm.get('streetName')?.value ?? '',
        houseNumber: this.employeeForm.get('houseNumber')?.value ?? '',
        postalCode: this.employeeForm.get('postalCode')?.value ?? '',
        locality: this.employeeForm.get('locality')?.value ?? '',
        province: this.employeeForm.get('province')?.value ?? '',
        country: this.employeeForm.get('country')?.value ?? '',
      };
      this.employeeService.createEmployee(+this.departmentId, employee);
      console.log(
        'EmployeeFormComponent.onSubmit(): CREATE, first name[%s], last name[%s]',
        employee?.firstName,
        employee?.lastName
      );
    } else if (this.operation === 'READ') {
      const employee = this.employeeService.getEmployee(
        +this.departmentId,
        +this.id
      );
      console.log(
        'EmployeeFormComponent.onSubmit(): READ, id[%d], first name[%s], last name[%s]',
        this.id,
        employee?.firstName,
        employee?.lastName
      );
    } else if (this.operation === 'UPDATE') {
      const employee: Employee = {
        id: +this.id,
        firstName: this.employeeForm.get('firstName')?.value ?? '',
        lastName: this.employeeForm.get('lastName')?.value ?? '',
        title: this.employeeForm.get('title')?.value ?? Title.Developer,
        phone: this.employeeForm.get('phone')?.value ?? '',
        mail: this.employeeForm.get('mail')?.value ?? '',
        streetName: this.employeeForm.get('streetName')?.value ?? '',
        houseNumber: this.employeeForm.get('houseNumber')?.value ?? '',
        postalCode: this.employeeForm.get('postalCode')?.value ?? '',
        locality: this.employeeForm.get('locality')?.value ?? '',
        province: this.employeeForm.get('province')?.value ?? '',
        country: this.employeeForm.get('country')?.value ?? '',
      };
      this.employeeService.updateEmployee(+this.departmentId, employee);
      console.log(
        'EmployeeFormComponent.onSubmit(): UPDATE, id[%d], first name[%s], last name[%s]',
        this.id,
        employee?.firstName,
        employee?.lastName
      );
    } else if (this.operation === 'DELETE') {
      this.employeeService.deleteEmployee(+this.departmentId, +this.id);
      console.log('EmployeeFormComponent.onSubmit(): DELETE, id[%s]', this.id);
    }
    this.router.navigate(['/employee-table', this.departmentId], {
      relativeTo: this.route,
    });
  }

  /**
   * The cancel action handler.
   * It resets the form and navigates back to the employee table.
   */
  onCancel() {
    this.employeeForm.reset();
    console.log('EmployeeFormComponent.onCancel():');
    this.router.navigate(['/employee-table', this.departmentId], {
      relativeTo: this.route,
    });
  }
}
