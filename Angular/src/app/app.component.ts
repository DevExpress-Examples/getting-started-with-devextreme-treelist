import { Component } from '@angular/core';
import {
  Employee,
  DragChangeEvent,
  ReorderEvent,
  SelectionChangedEvent,
} from './app.types';
import { EmployeesService } from './employees.service';

import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';

@Component({
    selector: 'app-root',
    imports: [DxTreeListModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  employees: Employee[] = [];

  selectedEmployee: Employee | null = null;

  expanded = true;

  expandedRowKeys: number[] = [];

  constructor(private readonly employeesService: EmployeesService) {
    this.employees = this.employeesService.getEmployees();
    this.selectEmployee = this.selectEmployee.bind(this);
    this.onReorder = this.onReorder.bind(this);
    this.onDragChange = this.onDragChange.bind(this);
  }

  selectEmployee(e: SelectionChangedEvent): void {
    e.component.byKey(e.currentSelectedRowKeys[0]).then((employee: Employee) => {
      if (employee) {
        this.selectedEmployee = employee;
      }
    }).catch(() => {
      // Handle error silently
    });
  }

  onDragChange(e: DragChangeEvent): void {
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.ID);
    let targetNode = visibleRows[e.toIndex].node;

    while (targetNode?.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      const parentNode = targetNode.parent;
      if (!parentNode) {
        break;
      }
      targetNode = parentNode;
    }
  }

  onReorder(e: ReorderEvent): void {
    const visibleRows = e.component.getVisibleRows();
    const sourceData = e.itemData;
    const targetData = visibleRows[e.toIndex].data;

    if (e.dropInsideItem) {
      e.itemData.HeadID = targetData.ID;
      e.component.refresh().catch(() => {
        // Handle error silently
      });
    } else {
      let targetIndex = this.employees.indexOf(targetData);

      if (sourceData.HeadID !== targetData.HeadID) {
        sourceData.HeadID = targetData.HeadID;
        if (e.toIndex > e.fromIndex) {
          targetIndex += 1;
        }
      }

      this.employeesService.reorderEmployees(sourceData, targetIndex);
      this.employees = this.employeesService.getEmployees();
    }
  }

  toggleExpansion(): void {
    this.expanded = !this.expanded;
    this.expandedRowKeys = [];
  }
}
