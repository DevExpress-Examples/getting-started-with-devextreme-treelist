import { useCallback, useState } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import TreeList, {
  ColumnChooser,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  Selection,
  Editing,
  Toolbar,
  Item,
  RowDragging,
  Paging,
  Scrolling,
  type TreeListTypes,
} from 'devextreme-react/tree-list';
import Button from 'devextreme-react/button';
import { employeesService, type Employee } from './employeesService';

interface SelectedEmployeeProps {
  employee: Employee | null;
}

function SelectedEmployee({ employee }: SelectedEmployeeProps): JSX.Element | null {
  if (employee) {
    return (
      <p id="selected-employee">
        Selected employee: {employee.FullName}
      </p>
    );
  }
  return null;
}

function App(): JSX.Element {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [currentEmployees, setCurrentEmployees] = useState<Employee[]>(employeesService.getEmployees());

  const selectEmployee = useCallback((e: TreeListTypes.SelectionChangedEvent) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).then((employee: Employee) => {
      if (employee) {
        setSelectedEmployee(employee);
      }
    }).catch(() => {
      // Handle error silently
    });
  }, []);

  const onOptionChanged = useCallback((e: any) => {
    if (e.name === 'expandedRowKeys') {
      setExpandedRowKeys(e.value);
    }
  }, []);

  const onDragChange = useCallback((e: any) => {
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.ID);
    let targetNode: TreeListTypes.Node<any, any> | undefined = visibleRows[e.toIndex].node;

    while (targetNode?.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }, []);

  const onReorder = useCallback((e: any) => {
    const visibleRows = e.component.getVisibleRows();
    const sourceData = e.itemData;
    const targetData = visibleRows[e.toIndex].data;

    if (e.dropInsideItem) {
      const updatedSourceData = { ...sourceData, HeadID: targetData.ID };
      employeesService.updateEmployee(updatedSourceData);
    } else {
      let targetIndex = currentEmployees.indexOf(targetData);
      if (sourceData.HeadID !== targetData.HeadID) {
        sourceData.HeadID = targetData.HeadID;
        if (e.toIndex > e.fromIndex) {
          targetIndex += 1;
        }
      }
      employeesService.reorderEmployees(sourceData, targetIndex);
    }

    setCurrentEmployees(employeesService.getEmployees());
    e.component.refresh();
  }, [currentEmployees]);

  const toggleExpansion = useCallback(() => {
    setExpanded((prevExpanded: boolean) => !prevExpanded);
    setExpandedRowKeys([]);
  }, []);

  return (
    <div id="app-container">
      <TreeList
        id="tree-list"
        dataSource={currentEmployees}
        rootValue={-1}
        keyExpr="ID"
        parentIdExpr="HeadID"
        autoExpandAll={expanded}
        expandedRowKeys={expandedRowKeys}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        onSelectionChanged={selectEmployee}
        onOptionChanged={onOptionChanged}
        height={800}
      >
        <Column dataField="FullName">
          <RequiredRule />
        </Column>
        <Column dataField="Position">
          <RequiredRule />
        </Column>
        <Column dataField="BirthDate" dataType="date" width={100}>
          <RequiredRule />
        </Column>
        <Column dataField="HireDate" dataType="date" width={100}>
          <RequiredRule />
        </Column>
        <Column dataField="City" />
        <Column dataField="State">
          <RequiredRule />
        </Column>
        <Column dataField="Email" visible={false} />
        <Column dataField="MobilePhone" />
        <Column dataField="Skype" />

        <ColumnFixing enabled={true} />
        <ColumnChooser enabled={true} />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Selection mode="single" />

        <Toolbar>
          <Item location="after">
            <Button
              text={expanded ? 'Collapse All' : 'Expand All'}
              width={136}
              onClick={toggleExpansion}
            />
          </Item>
          <Item name="addRowButton" showText="always" />
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
          <Item name="searchPanel" />
        </Toolbar>

        <RowDragging
          onDragChange={onDragChange}
          onReorder={onReorder}
          allowDropInsideItem={true}
          allowReordering={true}
          showDragIcons={true}
        />

        <Paging enabled={true} defaultPageSize={12} />
        <Scrolling mode="standard" />
      </TreeList>
      <SelectedEmployee employee={selectedEmployee} />
    </div>
  );
}

export default App;
