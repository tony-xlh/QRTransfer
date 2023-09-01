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
      <ion-list>
        <ion-item v-for="file in files">
          <FileCard
            :file="file"
          ></FileCard>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import FileCard from '@/components/FileCard.vue';
import { FilesManager, ScannedFile } from '@/utils/FilesManager';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const files = ref<ScannedFile[]>([]);

onMounted(async () => {
  let manager = new FilesManager();
  files.value = await manager.listFiles();
})
</script>
