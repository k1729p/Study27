/**
 * Application tools.
 */
export class AppTools {
  /**
   * Display department name.
   * @param departmentName the department name
   */
  displayDepartmentName(departmentName: string): string {
    if(departmentName.toLowerCase().includes('front office')) {
        return '🟢 ' + departmentName;
    } else if(departmentName.toLowerCase().includes('middle office')) {
        return '🟡 ' + departmentName;
    } else if(departmentName.toLowerCase().includes('back office')) {
        return '🟠 ' + departmentName;
    } else {
        return '🟣 ' + departmentName;
    }
  }
}
