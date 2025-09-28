<template>
  <div id="app-container">
    <DxTreeList id="treeList"
      :data-source="employees"
      :root-value="-1"
      key-expr="ID"
      parent-id-expr="HeadID"
      :auto-expand-all="true"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      @selection-changed="selectEmployee">
      <DxColumn data-field="FullName" :fixed="true">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn 
        data-field="Position">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
        :width="100">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="HireDate"
        data-type="date"
        :width="100">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="City" />
      <DxColumn
        data-field="State">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="Email" :visible="false" />
      <DxColumn data-field="MobilePhone" />
      <DxColumn data-field="Skype" />
      
      <DxColumnFixing :enabled="true" />
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxSelection mode="single" />
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
      />

      <DxRowDragging
        :on-drag-change="onDragChange"
        :on-reorder="onReorder"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        :show-drag-icons="true"
      />

      <DxPaging
        :enabled="true"
        :page-size="10"
      />
    </DxTreeList>
    <p id="selected-employee" v-if="selectedEmployee">
      Selected employee: {{ selectedEmployee.FullName }}
    </p>
  </div>
</template>

<script>
import {
  DxTreeList,
  DxColumn,
  DxRequiredRule,
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxSelection,
  DxEditing,
  DxRowDragging,
  DxPaging
} from 'devextreme-vue/tree-list';
import service from './employees.service';

export default {
  name: 'App',
  components: {
    DxTreeList,
    DxColumn,
    DxRequiredRule,
    DxColumnChooser,
    DxColumnFixing,
    DxFilterRow,
    DxSearchPanel,
    DxSelection,
    DxEditing,
    DxRowDragging,
    DxPaging
  },
  data() {
    return {
      employees: service.getEmployees(),
      selectedEmployee: undefined,
    }
  },
  methods: {
    selectEmployee(e) {
      e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
        if(employee) {
          this.selectedEmployee = employee;
        }
      });
    },
    onDragChange(e) {
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
    },
    onReorder(e) {
      let visibleRows = e.component.getVisibleRows(),
        sourceData = e.itemData,
        targetData = visibleRows[e.toIndex].data;

      if (e.dropInsideItem) {
        e.itemData.HeadID = targetData.ID;
        e.component.refresh();
      } else {
        let sourceIndex = this.employees.indexOf(sourceData),
          targetIndex = this.employees.indexOf(targetData);

        if (sourceData.HeadID !== targetData.HeadID) {
          sourceData.HeadID = targetData.HeadID;
          if (e.toIndex > e.fromIndex) {
            targetIndex++;
          }
        }

        this.employees.splice(sourceIndex, 1);
        this.employees.splice(targetIndex, 0, sourceData);

        this.employees = this.employees.slice();
      }
    }
  }
}
</script>

<style>
#treeList {
  height: 500px;
}

#app-container {
  width: 900px;
  position: relative;
}

#selected-employee {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
