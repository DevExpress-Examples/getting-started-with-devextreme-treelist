$(function() {
    const treeList = $("#treeList").dxTreeList({
        dataSource: employees,
        rootValue: -1,
        keyExpr: "ID",
        parentIdExpr: "HeadID",
        autoExpandAll: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnFixing: {
            enabled: true
        },
        columnChooser: { enabled: true },
        columns: [{
            dataField: "FullName",
            validationRules: [{
                type: "required"
            }],
            fixed: true
        }, {
            dataField: "Position",
            validationRules: [{
                type: "required"
            }]
        }, {
            dataField: "BirthDate", 
            dataType: "date",
            width: 100,
            validationRules: [{
                type: "required"
            }]
        }, {
            dataField: "HireDate", 
            dataType: "date",
            width: 100,
            validationRules: [{
                type: "required"
            }]
        }, "City", {
            dataField: "State",
            validationRules: [{
                type: "required"
            }]
        }, {
            dataField: "Email",
            visible: false
        }, "MobilePhone", "Skype"],
        filterRow: { visible: true },
        searchPanel: { visible: true },     
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true
        },
        selection: { mode: "single" },
        onSelectionChanged: function(e) {
            e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
                if(employee) {
                    $("#selected-employee").text(`Selected employee: ${employee.FullName}`);
                }
            });
        },
        rowDragging: {
            allowDropInsideItem: true,
            allowReordering: true,
            onDragChange: function(e) {
                var visibleRows = treeList.getVisibleRows(),
                    sourceNode = treeList.getNodeByKey(e.itemData.ID),
                    targetNode = visibleRows[e.toIndex].node;

                while (targetNode && targetNode.data) {
                    if (targetNode.data.ID === sourceNode.data.ID) {
                        e.cancel = true;
                        break;
                    }
                    targetNode = targetNode.parent;
                }
            },
            onReorder: function(e) {
                var visibleRows = e.component.getVisibleRows(),
                    sourceData = e.itemData,
                    targetData = visibleRows[e.toIndex].data;

                if (e.dropInsideItem) {
                    e.itemData.HeadID = targetData.ID;
                } else {
                    var sourceIndex = employees.indexOf(sourceData),
                        targetIndex = employees.indexOf(targetData);

                    if (sourceData.HeadID !== targetData.HeadID) {
                        sourceData.HeadID = targetData.HeadID;
                        if (e.toIndex > e.fromIndex) {
                            targetIndex++;
                        }
                    }
                    employees.splice(sourceIndex, 1);
                    employees.splice(targetIndex, 0, sourceData);
                }
                e.component.refresh();
            }
        },
        paging: {
            enabled: true,
            pageSize: 10
        }
    }).dxTreeList("instance");
});