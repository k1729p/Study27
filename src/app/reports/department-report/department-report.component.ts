import { inject, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Department } from '../../models/department';
import { Employee } from '../../models/employee';

import { DepartmentService } from '../../services/department-service/department.service';
import { EmployeeService } from '../../services/employee-service/employee.service';

/**
 * Node for company structure
 */
interface CompanyNode {
  name: string;
  type: string;
  children?: CompanyNode[];
}

/**
 * @title Tree with flat nodes (childrenAccessor)
 */
@Component({
  selector: 'app-department-report',
  templateUrl: 'department-report.component.html',
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentReportComponent implements OnInit {
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);

  dataSource: CompanyNode[] = [];

  childrenAccessor = (node: CompanyNode) => node.children ?? [];

  hasChild = (_: number, node: CompanyNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit() {
    // Get departments and employees from services
    const departments: Department[] =
      this.departmentService.getDepartmentArray();
    const employeesByDepartment: Employee[][] =
      this.employeeService.getEmployeeArray();

    this.dataSource = departments.map((department) => {
      const employeeList: Employee[] =
        employeesByDepartment[department.id - 1] || [];

      // Group employees by their title (Manager, Analyst, Developer)
      const groups: { [title: string]: Employee[] } = {};
      for (const employee of employeeList) {
        // employee.title is of type Title (enum)
        const title = employee.title ?? 'Unknown';
        if (!groups[title]) groups[title] = [];
        groups[title].push(employee);
      }

      // For each group, create a group node with employees as children
      const groupNodes: CompanyNode[] = Object.entries(groups).map(
        ([title, employees]) => ({
          name: title, // Title is string here because enums are string-valued
          type: 'group',
          children: employees.map((employee) => ({
            name: employee.firstName + ' ' + employee.lastName,
            type: 'person',
            children: [
              { name: employee.phone, type: 'call' },
              { name: employee.mail, type: 'alternate_email' },
            ],
          })),
        })
      );

      return {
        name: department.name,
        type: 'business',
        children: groupNodes,
      };
    });

    // For debugging
    console.log(
      'TreeComponentChildrenAccessor.ngOnInit() dataSource:',
      this.dataSource
    );
  }
}
