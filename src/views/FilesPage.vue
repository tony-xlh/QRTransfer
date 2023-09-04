<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Files</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Files</ion-title>
        </ion-toolbar>
      </ion-header>
      <FileCard v-for="(file,index) in files"
        :file="file"
        :show-delete-button="true"
        @deleted="deleteTriggered(index)"
      ></FileCard>
      <ion-action-sheet 
        :is-open="isSheetOpen"
        header="Actions" 
        :buttons="actionSheetButtons"
        @didDismiss="setActionResult($event)"
      ></ion-action-sheet>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import FileCard from '@/components/FileCard.vue';
import { FilesManager, ScannedFile } from '@/utils/FilesManager';
import { IonActionSheet, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList } from '@ionic/vue';
import { onUpdated, ref } from 'vue';

const isSheetOpen = ref(false);
let manager = new FilesManager();
let selectedIndex = -1;
const files = ref<ScannedFile[]>([]);

onUpdated(async () => {  
  files.value = await manager.listFiles();
})

const deleteTriggered = (index:number) => {
  selectedIndex = index;
  isSheetOpen.value = true;
}

const deteleFile = async (index:number) => {
  await manager.deleteFile(files.value[index].timestamp.toString())
  files.value = await manager.listFiles();
}

const actionSheetButtons = [
  {
    text: 'Delete',
    role: 'destructive',
    data: {
      action: 'delete',
    },
  },
  {
    text: 'Cancel',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
];

const setActionResult = async (ev: CustomEvent) => {
  if (!ev.detail.data) {
    return;
  }
  if (ev.detail.data.action === "delete") {
    await deteleFile(selectedIndex)
    selectedIndex = -1;
  }
  isSheetOpen.value = false;
  
}
</script>
