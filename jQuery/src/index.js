$(() => {
  const treeList = $('#tree-list').dxTreeList({
    dataSource: employees,
    rootValue: -1,
    keyExpr: 'ID',
    parentIdExpr: 'HeadID',
    autoExpandAll: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    columnFixing: {
      enabled: true,
    },
    columnChooser: { enabled: true },
    columns: [{
      dataField: 'FullName',
      validationRules: [{
        type: 'required',
      }],
      fixed: true,
    }, {
      dataField: 'Position',
      validationRules: [{
        type: 'required',
      }],
    }, {
      dataField: 'BirthDate',
      dataType: 'date',
      width: 100,
      validationRules: [{
        type: 'required',
      }],
    }, {
      dataField: 'HireDate',
      dataType: 'date',
      width: 100,
      validationRules: [{
        type: 'required',
      }],
    }, 'City', {
      dataField: 'State',
      validationRules: [{
        type: 'required',
      }],
    }, {
      dataField: 'Email',
      visible: false,
    }, 'MobilePhone', 'Skype'],
    filterRow: { visible: true },
    searchPanel: { visible: true },
    editing: {
      mode: 'popup',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    selection: { mode: 'single' },
    onSelectionChanged(e) {
      e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
        if (employee) {
          $('#selected-employee').text(`Selected employee: ${employee.FullName}`);
        }
      });
    },
    toolbar: {
      items: [
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            text: 'Collapse All',
            width: 136,
            onClick(e) {
              const expanding = e.component.option('text') === 'Expand All';
              treeList.option({
                autoExpandAll: expanding,
                expandedRowKeys: [],
              });
              e.component.option('text', expanding ? 'Collapse All' : 'Expand All');
            },
          },
        },
        {
          name: 'addRowButton',
          showText: 'always',
        },
        'exportButton',
        'columnChooserButton',
        'searchPanel',
      ],
    },
    rowDragging: {
      allowDropInsideItem: true,
      allowReordering: true,
      onDragChange(e) {
        const visibleRows = treeList.getVisibleRows();
        const sourceNode = treeList.getNodeByKey(e.itemData.ID);
        let targetNode = visibleRows[e.toIndex].node;

        while (targetNode && targetNode.data) {
          if (targetNode.data.ID === sourceNode.data.ID) {
            e.cancel = true;
            break;
          }
          targetNode = targetNode.parent;
        }
      },
      onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const sourceData = e.itemData;
        const targetData = visibleRows[e.toIndex].data;

        if (e.dropInsideItem) {
          e.itemData.HeadID = targetData.ID;
        } else {
          const sourceIndex = employees.indexOf(sourceData);
          let targetIndex = employees.indexOf(targetData);

          if (sourceData.HeadID !== targetData.HeadID) {
            sourceData.HeadID = targetData.HeadID;
            if (e.toIndex > e.fromIndex) {
              targetIndex += 1;
            }
          }
          employees.splice(sourceIndex, 1);
          employees.splice(targetIndex, 0, sourceData);
        }
        e.component.refresh();
      },
    },
    paging: {
      enabled: true,
      pageSize: 10,
    },
    height: 800,
    scrolling: {
      mode: 'standard'
    }
  }).dxTreeList('instance');
});
