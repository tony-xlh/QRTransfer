<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ file.filename }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div class="item">
        <ion-thumbnail slot="start" style="margin-right:10px;">
          <img v-if="file.mimeType.indexOf('image') != -1" alt="image" :src="file.dataURL" />
          <img v-else alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
        </ion-thumbnail>
        <div class="info">
          <ion-label>{{ "Filesize: " + (file.filesize/1000).toFixed(2) + "KB" }}</ion-label>
          <ion-label>{{ "Date: " + file.date.toLocaleDateString() }}</ion-label>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import { ScannedFile } from '@/utils/FilesManager';

const props = defineProps<{
  file:ScannedFile
}>()
</script>

<style scoped>
.item {
  display: flex;
  align-items: start;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.info ion-label {
  margin-right: 10px;
}
</style>