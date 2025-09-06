<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <style>
    table,
    th,
    td {
      border: 1px solid black;
    }
  </style>
</head>

<body>
  <img alt="" src="images/WORK-IN-PROGRESS.png" />

  <a href="https://github.com/k1729p/Study27/tree/main/docs" title="View Study27 docs on GitHub">
    <img alt="Color scheme for Study27 project" src="images/ColorScheme.png" height="25" width="800" />
  </a>
  <h2 id="contents">Study27 README Contents</h2>

  <h3>
    <a href="https://github.com/k1729p/Study27/blob/main/docs/mermaid/flowchart.md">Business Logic Diagram</a>
  </h3>
  <p>This diagram contains the links to screenshots.</p>
  <hr>
  <h3>Dictionary</h3>
  <table>
    <tbody>
      <tr>
        <td>
          <a href="https://material.angular.io/components/categories">Angular Material categories</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://material.angular.io/cdk/categories">Component Dev Kit (CDK) categories</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://fonts.google.com/icons?icon.size=24&icon.color=%231f1f1f">Google Icons</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://pdfmake.github.io/docs/0.1/">pdfmake</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="http://pdfmake.org/playground.html">pdfmake playground</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://m3.material.io/">Material Design 3</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://angular.dev/tools/cli">Angular CLI Overview and Command Reference</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://angular.dev/ecosystem/rxjs-interop">RxJS in Angular</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://karma-runner.github.io/">Karma</a>
        </td>
        <td>
          -
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://github.com/bitnami/containers">Bitnami Images</a>
        </td>
        <td>
          The Bitnami Containers Library is used as a source of Kubernetes images
        </td>
      </tr>
    </tbody>
  </table>

  <h3>Acronyms</h3>
  <table>
    <tbody>
      <tr>
        <td>ARIA</td>
        <td>Accessible Rich Internet Applications</td>
      </tr>
      <tr>
        <td>CDK</td>
        <td>Component Dev Kit</td>
      </tr>
      <tr>
        <td>CSR</td>
        <td>Client-side Rendering</td>
      </tr>
      <tr>
        <td>ESM</td>
        <td>ECMAScript Module</td>
      </tr>
      <tr>
        <td>PWA</td>
        <td>Progressive Web Application</td>
      </tr>
      <tr>
        <td>SPA</td>
        <td>Single Page Application</td>
      </tr>
      <tr>
        <td>SSG</td>
        <td>Static Site Generation</td>
      </tr>
      <tr>
        <td>SSR</td>
        <td>Server-Side Rendering</td>
      </tr>
      <tr>
        <td>
        <td> </td>
      </tr>
    </tbody>
  </table>
  <hr>
  <pre>
Work-In-Progress temporary notes, fixes, and todos:

This Angular Material project uses Material Design 2.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copilot says: Observable Approach (Angular way)

Use observables and signals. Don't use promises. 
    const departmentsPromise: Promise<Department[]> = firstValueFrom(departmentsObservable);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
pdfmake
Client/server side PDF printing in pure JavaScript http://pdfmake.org
npm install pdfmake
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
## Build
Run `ng build` to build the project.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
=== Front end testing tool Cypress ===
npm install cypress --save-dev

npx cypress open
npx cypress open --browser chrome --e2e

Runs Cypress tests to completion. By default, cypress run will run all tests headlessly.
npx cypress run --browser chrome
npx cypress run --browser chrome --spec "cypress/e2e/0-local-storage-tests/12_create_department_and_employee.cy.ts"

npx cypress run --browser chrome --spec "cypress/e2e/0-local-storage-tests/spec_01.cy.ts,cypress/e2e/0-local-storage-tests/spec_02.cy.ts"
npx cypress run --browser chrome --headed --no-exit

https://docs.cypress.io/app/guides/screenshots-and-videos
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

=== Angular HTTP Client ===
https://angular.dev/guide/http
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
===  Dockerize Angular Application  ===
https://docs.docker.com/guides/angular/containerize/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	- presentation layer   (aka user interface layer)
	- application layer    (aka service layer)
	- business logic layer (aka domain layer)
	- data access layer    (aka persistence layer)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  </pre>
  <hr>
</body>

</html>
