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
            @deleted="deteleFile(index)"
          ></FileCard>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import FileCard from '@/components/FileCard.vue';
import { FilesManager, ScannedFile } from '@/utils/FilesManager';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList } from '@ionic/vue';
import { onMounted, ref } from 'vue';

let manager = new FilesManager();
const files = ref<ScannedFile[]>([]);

onMounted(async () => {  
  files.value = await manager.listFiles();
})

const deteleFile = async (index:number) => {
  await manager.deleteFile(files.value[index].timestamp.toString())
  files.value = await manager.listFiles();
}
</script>
