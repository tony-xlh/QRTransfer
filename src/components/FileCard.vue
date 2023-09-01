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
          <ion-label>{{ "Date: " + new Date(file.timestamp).toLocaleDateString() }}</ion-label>
        </div>
        <div class="span"></div>
        <div class="action">
          <ion-button @click="share" fill="clear">
            <ion-icon slot="icon-only" :icon="shareOutline"/>
          </ion-button>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import { ScannedFile } from '@/utils/FilesManager';
import { IonButton,IonCard,IonCardContent,IonCardTitle,IonCardHeader,IonLabel,IonThumbnail, IonIcon } from '@ionic/vue';
import { shareOutline } from 'ionicons/icons';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from "@capacitor/core";

const props = defineProps<{
  file:ScannedFile
}>()

const share = async () => {
  if (Capacitor.isNativePlatform()) {
    let writingResult = await Filesystem.writeFile({
      path: props.file.filename,
      data: props.file.dataURL,
      directory: Directory.Cache
    });
    Share.share({
      title: props.file.filename,
      text: props.file.filename,
      url: writingResult.uri,
    });
  }else{
    const blob = dataURLtoBlob(props.file.dataURL);
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob);
    link.download = props.file.filename;
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const dataURLtoBlob = (dataURL:string):Blob => {
  const mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mime});
}

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
.span {
  flex:1;
}
</style>