const SITE = 'http://localhost:8028/api';
/**
 * API endpoints for the backend application.
 */
export const ENDPOINTS = {
  loadInitialData: (repositoryType: string) =>
    `${SITE}/load?repositoryType=${repositoryType}`,

  getDepartments: (repositoryType: string) =>
    `${SITE}/departments?repositoryType=${repositoryType}`,

  createDepartment: (repositoryType: string) =>
    `${SITE}/departments?repositoryType=${repositoryType}`,

  createEmployee: (repositoryType: string) =>
    `${SITE}/employees?repositoryType=${repositoryType}`,

  updateDepartment: (id: number | string, repositoryType: string) =>
    `${SITE}/departments/${id}?repositoryType=${repositoryType}`,

  updateEmployee: (id: number | string, repositoryType: string) =>
    `${SITE}/employees/${id}?repositoryType=${repositoryType}`,

  deleteDepartment: (id: number | string, repositoryType: string) =>
    `${SITE}/departments/${id}?repositoryType=${repositoryType}`,

  deleteEmployee: (id: number | string, repositoryType: string) =>
    `${SITE}/employees/${id}?repositoryType=${repositoryType}`,

  transferEmployees: (repositoryType: string) =>
    `${SITE}/transfers/?repositoryType=${repositoryType}`,
};
