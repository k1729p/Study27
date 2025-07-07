import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

/**
 * A component for transferring employees between departments.
 */
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
  private formBuilder = inject(FormBuilder);
  leftZzzId = 0;
  rightZzzId = 0;
  zzzArr = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
    { id: 5, name: 'E' },
  ];
  private emptyZzz = { id: 0, name: '' };
  zzzForm = this.formBuilder.group({
    leftZzzSelect: this.emptyZzz,
    rightZzzSelect: this.emptyZzz,
  });
  ngOnInit() {
    // this.zzzForm.controls.leftZzzSelect.setValue(this.zzzArr.find(zzz => zzz.name === 'A'));
    let index = this.zzzArr.findIndex((zzz) => zzz.name === 'A');
    if (index === -1) {
      return;
    }
    this.zzzForm.controls.leftZzzSelect.setValue(this.zzzArr[index]);
    index = this.zzzArr.findIndex((zzz) => zzz.name === 'B');
    if (index === -1) {
      return;
    }
    this.zzzForm.controls.rightZzzSelect.setValue(this.zzzArr[index]);

//    this.zzzForm.controls.leftZzzSelect.setValue(this.zzzArr[0]);
//    this.zzzForm.controls.rightZzzSelect.setValue(this.zzzArr[1]);
    console.log(
      'AaaComponent.ngOnInit(): left zzz id[%d], right zzz id[%d]',
      this.leftZzzId,
      this.rightZzzId
    );
  }
  selectLeftZzz(id: number) {
    this.leftZzzId = id;
    console.log(
      'AaaComponent.selectLeftZzz(): left zzz id[%d]',
      this.leftZzzId
    );
  }
  selectRightZzz(id: number) {
    this.rightZzzId = id;
    console.log(
      'AaaComponent.selectRightZzz(): right zzz id[%d]',
      this.rightZzzId
    );
  }
}
