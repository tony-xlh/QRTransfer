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
          <FileCard v-for="file in files" style="width:100%;"
            :file="file"
          ></FileCard>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import FileCard from '@/components/FileCard.vue';
import { FilesManager, ScannedFile } from '@/utils/FilesManager';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const files = ref<ScannedFile[]>([]);

onMounted(async () => {
  let manager = new FilesManager();
  files.value = await manager.listFiles();
})
</script>
