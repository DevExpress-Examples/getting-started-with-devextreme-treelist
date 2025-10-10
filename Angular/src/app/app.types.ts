import { DxTreeListTypes } from 'devextreme-angular/ui/tree-list';

export interface Employee {
  ID: number;
  HeadID: number;
  FullName: string;
  Position: string;
  City: string;
  State: string;
  Email: string;
  Skype: string;
  MobilePhone: string;
  BirthDate: string;
  HireDate: string;
}

export type DragChangeEvent = DxTreeListTypes.RowDraggingChangeEvent;
export type ReorderEvent = DxTreeListTypes.RowDraggingReorderEvent;
export type SelectionChangedEvent = DxTreeListTypes.SelectionChangedEvent;
