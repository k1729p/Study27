import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTreeModule, MatTree } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

interface KpNode {
  name: string;
  children?: KpNode[];
}

@Component({
  selector: 'app-aaa',
  templateUrl: 'aaa.html',
  imports: [
    MatTreeModule,
    MatTree,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAaa implements OnInit {
  filteredNames: Observable<string[]> | undefined;
  formControl = new FormControl('');

  ngOnInit() {
    this.filteredNames = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.namesArray.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }
  dataSource = [
    {
      name: 'abc',
      children: [
        {
          name: 'bcd',
          children: [{ name: 'cde', children: [{ name: 'def' }] }],
        },
      ],
    },
    {
      name: 'fgh',
      children: [
        {
          name: 'ghi',
          children: [{ name: 'hij', children: [{ name: 'ijk' }] }],
        },
      ],
    },
  ];

  namesArray: string[] = [
    'abc',
    'bcd',
    'cde',
    'def',
    'fgh',
    'ghi',
    'hij',
    'ijk',
  ];

  /**
   * Gets the children of a node.
   * This function is used by the MatTree to retrieve the children of a node.
   * It returns an empty array if the node has no children.
   *
   * @param node - The node for which to get the children.
   * @returns The children of the node, or an empty array if there are none.
   */
  childrenAccessor = (node: KpNode) => node.children ?? [];

  /**
   * Checks if a node has children.
   * This function is used by the MatTree to determine if a node can be expanded.
   * It returns true if the node has children, false otherwise.
   *
   * @param _ - The index of the node, not used in this implementation.
   * @param node - The node to check.
   * @returns True if the node has children, false otherwise.
   */
  hasChild = (_: number, node: KpNode) =>
    !!node.children && node.children.length > 0;

  /**
   * Expands a node in the tree by its name.
   * This function searches for a node with the specified name in the data source
   * and expands it in the MatTree instance.
   * If the node is found, it will be expanded and logged to the console.
   * If the node is not found, a warning will be logged.
   *
   * @param tree - The MatTree instance to operate on.
   * @param name - The name of the node to expand.
   */
  expandNodeByName(tree: MatTree<KpNode, KpNode>, name: string) {
    const expandedNodes = this.findPath(this.dataSource, name);
    if (expandedNodes) {
      expandedNodes.forEach((node) => {
        tree.expand(node);
        console.log('expandNodeByName(): expanded node name[%s]', node.name);
      });
    } else {
      console.warn('expandNodeByName(): node with name[%s] not found', name);
    }
  }

  /**
   * Recursively finds the path to a node by its name.
   * @param nodes - The array of nodes to search.
   * @param name - The name of the node to find.
   * @param path - The current path being built (used in recursion).
   * @returns An array of nodes representing the path to the found node, or null if not found.
   */
  private findPath(
    nodes: KpNode[],
    name: string,
    path: KpNode[] = []
  ): KpNode[] | null {
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
