import {
  inject,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { Observable, map, startWith } from 'rxjs';

import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';
/**
 * Node for company structure
 */
interface CompanyNode {
  name: string;
  type: string;
  children?: CompanyNode[];
}
/**
 * Dialog displaying warning message.
 */
@Component({
  template: `<h2 mat-dialog-title>Warning</h2>
    <mat-dialog-content>
      <p>Employee not found!</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close>OK</button>
    </mat-dialog-actions>`,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class WarningMesssageDialog { }

/**
 * EmployeeLocateComponent is an Angular component that locates employees.
 * @title Tree with flat nodes (childrenAccessor)
 */
@Component({
  selector: 'app-employee-locate',
  templateUrl: 'employee-locate.component.html',
  styleUrl: './employee-locate.component.css',
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTree,
    MatTreeModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeLocateComponent implements OnInit {
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);
  @ViewChild('tree') tree!: MatTree<CompanyNode, CompanyNode>;

  dataSource: CompanyNode[] = [];
  employeeNames: Observable<string[]> | undefined;
  formControl = new FormControl('');
  dialog: MatDialog = inject(MatDialog);

  /**
   * Accessor for the children of a node.
   * This function is used by the MatTree component to retrieve the children of a node.
   * It checks if the node has a 'children' property
   * and returns it if it exists, or an empty array if it does not.
   * This is necessary for the MatTree to properly display
   * the hierarchical structure of the company data.
   *
   * @param node - The node whose children to retrieve.
   * @returns The children of the node, or an empty array if there are none.
   */
  childrenAccessor = (node: CompanyNode) => node.children ?? [];

  /**
   * Determines whether a node has children.
   * This function checks if the node has a 'children' property
   * and if it is an array with a length greater than zero.
   * It is used by the MatTree component to determine
   * whether to display the expand/collapse icon for a node.
   *
   * @param _ - The index of the node in the tree.
   * @param node - The node to check.
   * @returns True if the node has children, false otherwise.
   */
  protected hasChild = (_: number, node: CompanyNode) =>
    !!node.children && node.children.length > 0;

  /**
   * Initializes the component.
   * This function is called when the component is initialized.
   * It sets up the data source for the tree by retrieving the department data.
   * It maps each department to a structured data source
   * that can be used by the MatTree component.
   * It also collects the names of all person nodes in the tree
   * and sets up the employeeNames observable for the autocomplete functionality.
   */
  ngOnInit() {
    this.dataSource = this.departmentService.getDepartments()
      .map(department => this.loadDepartmentData(department));
    this.employeeNames = this.loadEmployeeNames();
    console.log('🟪EmployeeLocateComponent.ngOnInit():');
  }
  /**
   * Handler for the expand button.
   * Expands the node with the name currently selected in the autocomplete.
   * This function retrieves the value from the form control,
   * checks if it is a non-empty string, and then calls the expandNodeByName
   * method to expand the corresponding node in the tree.
   * If the value is empty or not a string, it does nothing.
   */
  locateEmployee() {
    const name = this.formControl.value;
    if (!this.tree || typeof name !== 'string' || !name.trim()) {
      console.warn('EmployeeLocateComponent.locateEmployee(): empty employee name');
      return;
    }
    const expandedNodes = this.findPath(this.dataSource, name);
    if (!expandedNodes) {
      this.dialog.open(WarningMesssageDialog, { width: '250px' });
      console.warn('EmployeeLocateComponent.locateEmployee(): employee with name[%s] not found', name);
      return;
    }
    expandedNodes.forEach(node => {
      this.tree.expand(node);
      console.log('EmployeeLocateComponent.locateEmployee(): node type[%s], node name[%s]', node.type, node.name);
    });
    console.log('🟪EmployeeLocateComponent.locateEmployee():');
  }

  /**
   * Loads the data for a specific department.
   * This function retrieves the employees for a given department,
   * groups them by their title, and constructs a tree structure
   * representing the department's employees.
   * Each employee is represented as a 'person' node with their full name,
   * and has children nodes for their phone and email.
   * The top-level node represents the department itself.
   * It returns an object of type CompanyNode that represents the department
   * and its employees, structured in a way that can be used by the MatTree component
   * to display the hierarchy.
   *
   * @param {Department} department - The department for which to load the data source.
   * @returns {CompanyNode} An object representing the department and its employees.
   */
  private loadDepartmentData(department: Department) {
    const employees = this.employeeService.getEmployees(department.id);
    const groupedByTitle: Record<string, Employee[]> = {};
    for (const employee of employees) {
      const title = employee.title ?? 'Unknown';
      if (!groupedByTitle[title]) groupedByTitle[title] = [];
      groupedByTitle[title].push(employee);
    }
    const groupedByTitleNodes: CompanyNode[] =
      this.groupByTitle(groupedByTitle);
    return {
      name: department.name,
      type: 'department-name',
      children: groupedByTitleNodes,
    };
  }

  /**
   * Groups employees by their title.
   * This function takes an object where keys are titles and values are arrays of employees
   * with that title. It transforms this object into an array of CompanyNode objects,
   * where each node represents a group of employees with the same title.
   * Each node has a name that is the title followed by 's',
   * and a type of 'group'.
   * Each employee in the group is represented as a 'person' node with their full name
   * and has children nodes for their phone and email.
   *
   * @param groupedByTitle - An object where keys are titles and values are arrays of employees with that title.
   * This function transforms the groupedByTitle object into an array of CompanyNode objects.
   * @returns An array of CompanyNode objects.
   */
  groupByTitle(
    groupedByTitle: Record<string, Employee[]>
  ): CompanyNode[] {
    const customOrder = ['Manager', 'Analyst', 'Developer'];
    return Object.entries(groupedByTitle)
      .sort(([a], [b]) => {
        const indexA = customOrder.indexOf(a);
        const indexB = customOrder.indexOf(b);
        // If both are found in customOrder, sort by their index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only one is found, it comes first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // Otherwise, fallback to alphabetical
        return a.localeCompare(b);
      })
      .map(([title, employees]) => ({
        name: title + 's',
        type: 'employee-title',
        children: employees.map((employee) => ({
          name: employee.firstName + ' ' + employee.lastName,
          type: 'employee-name',
          children: [
            { name: employee.phone, type: 'employee-phone' },
            { name: employee.mail, type: 'employee-mail' },
          ],
        })),
      }));
  }
  /**
   * Loads employee names for the autocomplete.
   * This function collects the names of all person nodes in the tree
   * and sets up an observable that emits the filtered names
   * based on the input value from the form control.
   * It uses the `collectNames` method to gather all names
   * from the data source and then filters them
   * based on the user's input.
   * This is used to provide suggestions in the autocomplete input field.
   *
   * @returns An observable that emits an array of employee names.
   */
  private loadEmployeeNames(): Observable<string[]> {
    const namesArray: string[] = this.collectEmployeeNames(this.dataSource);
    return this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterNames(namesArray, value || ''))
    );
  }
  /**
   * Collects the names of all employee nodes in the tree.
   * This function traverses the tree recursively and collects the names
   * of all nodes that are of type 'employee-name'.
   *
   * @param nodes - The array of nodes to search.
   * @param acc - The accumulator array to collect names.
   * @returns An array of names of all person nodes.
   */
  collectEmployeeNames(
    nodes: CompanyNode[],
    acc: string[] = []
  ): string[] {
    for (const node of nodes) {
      if (node.type === 'employee-name' && node.name) {
        acc.push(node.name);
      }
      if (node.children) {
        this.collectEmployeeNames(node.children, acc);
      }
    }
    return acc;
  }

  /**
   * Filters the names in the namesArray based on the input value.
   * This function filters the names based on the input value.
   * It converts the input value to lowercase and checks if each name in the
   * namesArray includes the filterValue.
   * It returns an array of names that match the filter criteria.
   * This is used for the autocomplete functionality to show suggestions based on user input.
   *
   * @param namesArray - The array of names to filter.
   * @param value - The input value to filter the names.
   * @returns An array of names that match the filter criteria.
   */
  filterNames(namesArray: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 2) {
      return [];
    }
    return namesArray.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Recursively searches for a node by name in the company structure.
   * This function is used to find the path to a specific node in the
   * company structure, which is represented as a tree of CompanyNode objects.
   * It traverses the tree recursively, checking each node's name
   * and its children until it finds the node with the specified name.
   * If the node is found, it returns the path to that node as an array of
   * CompanyNode objects. If the node is not found, it returns null.
   *
   * @param nodes - The array of nodes to search.
   * @param name - The name of the node to find.
   * @param path - The current path being traversed.
   * @returns The path to the found node or null if not found.
   */
  findPath(
    nodes: CompanyNode[],
    name: string,
    path: CompanyNode[] = []
  ): CompanyNode[] | null {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.name === name) {
        return newPath;
      }
      if (node.children) {
        const result = this.findPath(node.children, name, newPath);
        if (result) return result;
      }
    }
    return null;
  }
}
