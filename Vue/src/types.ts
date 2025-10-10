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

export interface DragChangeEvent {
  component: any;
  itemData: Employee;
  toIndex: number;
  fromIndex: number;
  cancel: boolean;
}

export interface ReorderEvent {
  component: any;
  itemData: Employee;
  toIndex: number;
  fromIndex: number;
  dropInsideItem: boolean;
}

import type { DxTreeListTypes } from 'devextreme-vue/tree-list';

export type SelectionChangedEvent = DxTreeListTypes.SelectionChangedEvent;
