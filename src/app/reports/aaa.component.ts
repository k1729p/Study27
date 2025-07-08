import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-aaa',
  templateUrl: './aaa.component.html',
  styleUrl: './aaa.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
  ],
})
export class AaaComponent implements OnInit {
  zzzArr = [
    { id: 101, name: 'A' },
    { id: 102, name: 'B' },
    { id: 103, name: 'C' },
    { id: 104, name: 'D' },
    { id: 105, name: 'E' },
    { id: 106, name: 'F' },
    { id: 107, name: 'G' },
    { id: 108, name: 'H' },
    { id: 109, name: 'I' },
    { id: 110, name: 'J' },
    { id: 111, name: 'K' },
    { id: 112, name: 'L' },
    { id: 113, name: 'M' },
    { id: 114, name: 'N' },
    { id: 115, name: 'O' },
    { id: 116, name: 'P' },
    { id: 117, name: 'Q' },
    { id: 118, name: 'R' },
    { id: 119, name: 'S' },
    { id: 120, name: 'T' },
    { id: 121, name: 'U' },
    { id: 122, name: 'V' },
    { id: 123, name: 'W' },
    { id: 124, name: 'X' },
    { id: 125, name: 'Y' },
    { id: 126, name: 'Z' },
  ];
  ngOnInit() {
    console.log('AaaComponent.ngOnInit():');
  }
}
