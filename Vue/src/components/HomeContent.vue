<script setup lang="ts">
import { ref } from 'vue';
import { employeesService, type Employee } from '../employeesService';

import 'devextreme/dist/css/dx.fluent.blue.light.css';
import DxTreeList, {
  DxColumn,
  DxRequiredRule,
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxSelection,
  DxEditing,
  DxToolbar,
  DxItem,
  DxRowDragging,
  DxPaging,
  DxScrolling,
  type DxTreeListTypes,
} from 'devextreme-vue/tree-list';
import DxButton from 'devextreme-vue/button';

const employees = ref<Employee[]>(employeesService.getEmployees());
const selectedEmployee = ref<Employee | null>(null);
const expanded = ref<boolean>(true);
const expandedRowKeys = ref<number[]>([]);

const selectEmployee = (e: DxTreeListTypes.SelectionChangedEvent): void => {
  e.component.byKey(e.currentSelectedRowKeys[0]).then((employee: Employee) => {
    if (employee) {
      selectedEmployee.value = employee;
    }
  }).catch(() => {
    // Handle error silently
  });
};

const onDragChange = (e: any): void => {
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
};

const onReorder = (e: any): void => {
  const visibleRows = e.component.getVisibleRows();
  const sourceData = e.itemData;
  const targetData = visibleRows[e.toIndex].data;

  if (e.dropInsideItem) {
    e.itemData.HeadID = targetData.ID;
    employeesService.updateEmployee(e.itemData);
    e.component.refresh().catch(() => {
      // Handle error silently
    });
  } else {
    let targetIndex = employees.value.indexOf(targetData);

    if (sourceData.HeadID !== targetData.HeadID) {
      sourceData.HeadID = targetData.HeadID;
      if (e.toIndex > e.fromIndex) {
        targetIndex += 1;
      }
    }

    employeesService.reorderEmployees(sourceData, targetIndex);
    employees.value = employeesService.getEmployees();
  }

  e.component.refresh();
};

const toggleExpansion = (): void => {
  expanded.value = !expanded.value;
  expandedRowKeys.value = [];
};
</script>

<template>
  <div id="app-container">
    <DxTreeList
      id="tree-list"
      :data-source="employees"
      :root-value="-1"
      key-expr="ID"
      parent-id-expr="HeadID"
      :auto-expand-all="expanded"
      :expanded-row-keys="expandedRowKeys"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      @selection-changed="selectEmployee"
      :height="800"
    >
      <DxColumn
        data-field="FullName"
        :fixed="true"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="Position">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
        :width="100"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
        data-field="HireDate"
        data-type="date"
        :width="100"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="City"/>
      <DxColumn data-field="State">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
        data-field="Email"
        :visible="false"
      />
      <DxColumn data-field="MobilePhone"/>
      <DxColumn data-field="Skype"/>

      <DxColumnFixing :enabled="true"/>
      <DxColumnChooser :enabled="true"/>
      <DxFilterRow :visible="true"/>
      <DxSearchPanel :visible="true"/>
      <DxSelection mode="single"/>
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
      />

      <DxToolbar>
        <DxItem
          location="after"
          template="button-template"
        />
        <DxItem
          name="addRowButton"
          show-text="always"
        />
        <DxItem name="exportButton"/>
        <DxItem name="columnChooserButton"/>
        <DxItem name="searchPanel"/>
      </DxToolbar>
      <template #button-template>
        <DxButton
          :text="expanded ? 'Collapse All' : 'Expand All'"
          :width="136"
          @click="toggleExpansion"
        />
      </template>

      <DxRowDragging
        :on-drag-change="onDragChange"
        :on-reorder="onReorder"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        :show-drag-icons="true"
      />

      <DxPaging
        :enabled="true"
        :page-size="12"
      />
      <DxScrolling mode="standard"/>
    </DxTreeList>
    <p
      id="selected-employee"
      v-if="selectedEmployee"
    >
      Selected employee: {{ selectedEmployee.FullName }}
    </p>
  </div>
</template>

<style scoped>
#app-container {
  margin: 50px auto;
  padding: 20px;
  position: relative;
}

#selected-employee {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
