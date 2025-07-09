import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
/**
 * AppComponent is the root component of the application.
 * It serves as the main entry point for the application and contains the
 * navigation menu for the application.
 * This component uses Angular Material for styling and layout.
 * It includes a menu with options to navigate to different parts of the application,
 * such as the department table and employee transfers.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
],
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Study27';
  /**
   * ActivatedRoute and Router injected using inject() function.
   */
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  /**
   * Handles menu item selection and navigation.
   * This function is called when a menu item is clicked.
   *
   * @param id - The ID of the menu item that was clicked.
   */
  menuHandler(id: number) {
    switch (id) {
      case 1:
        this.router.navigate(['/department-table'], { relativeTo: this.route });
        break;
      case 2:
        this.router.navigate(['/employee-transfer'], {
          relativeTo: this.route,
        });
        break;
      case 3:
        this.router.navigate(['/department-report'], {
          relativeTo: this.route,
        });
        break;
      default:
        break;
    }
  }
}
