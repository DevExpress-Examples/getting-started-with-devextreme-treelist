import React, { useCallback, useState } from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './App.css'

import {
  TreeList,
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
  Paging
} from 'devextreme-react/tree-list';
import { Button } from 'devextreme-react/button';
import { employees } from './employees';

function SelectedEmployee(props) {
  if(props.employee) {
    return (
      <p id="selected-employee">
        Selected employee: {props.employee.FullName}
      </p>
    );
  }
  return null;
}

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [expanded, setExpanded] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [currentEmployees, setCurrentEmployees] = useState(employees);

  const selectEmployee = useCallback((e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
      setSelectedEmployee(employee);
    });
  }, []);

  const onOptionChanged = useCallback((e) => {
    if(e.name === 'expandedRowKeys') {
        setExpandedRowKeys(e.value);
    }
  }, []);

  const onDragChange = useCallback((e) => {
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.ID),
      targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }, []);

  const onReorder = useCallback((e) => {
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].data,
      employeesReordered = currentEmployees,
      sourceIndex = employeesReordered.indexOf(sourceData),
      targetIndex = employeesReordered.indexOf(targetData);

    if (e.dropInsideItem) {
      sourceData = { ...sourceData, HeadID: targetData.ID };
      employeesReordered = [...employeesReordered.slice(0, sourceIndex), sourceData, ...employeesReordered.slice(sourceIndex + 1)];
    } else {
      if (sourceData.HeadID !== targetData.HeadID) {
        sourceData = { ...sourceData, HeadID: targetData.HeadID };
        if (e.toIndex > e.fromIndex) {
          targetIndex++;
        }
      }
      employeesReordered = [...employeesReordered.slice(0, sourceIndex), ...employeesReordered.slice(sourceIndex + 1)];
      employeesReordered = [...employeesReordered.slice(0, targetIndex), sourceData, ...employeesReordered.slice(targetIndex)];
    }

    setCurrentEmployees(employeesReordered);
  }, []);

  return (
    <div className="App">
      <TreeList
        id="treeList"
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
        onOptionChanged={onOptionChanged}>
        <Column dataField="FullName">
          <RequiredRule />
        </Column>
        <Column 
          dataField="Position">
          <RequiredRule />
        </Column>
        <Column
          dataField="BirthDate"
          dataType="date"
          width={100}>
          <RequiredRule />
        </Column>
        <Column
          dataField="HireDate"
          dataType="date"
          width={100}>
          <RequiredRule />
        </Column>
        <Column dataField="City" />
        <Column
          dataField="State">
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
                onClick={() => {
                    setExpanded(prevExpanded => !prevExpanded)
                    setExpandedRowKeys([]);
                }}
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

        <Paging
          enabled={true}
          defaultPageSize={10} 
        />

      </TreeList>
      <SelectedEmployee employee={selectedEmployee} />
    </div>
  );
}

export default App;
