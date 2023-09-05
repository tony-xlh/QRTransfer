<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About</ion-title>
        <ion-button @click="goToSettingsPage" slot="end" fill="clear">
          <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="about">
        <h2>QR Transfer</h2>
        <p>This is a QR code scanner which can be used to transfer data between devices via QR codes.</p>
        <p>The sender separates the data of a file into chunks, stores them in QR codes and displays the QR codes in a loop. The receiver can scan the QR codes to get the data. The receiver can tell the sender which QR codes have been scanned so that the sender will skip them (two-way communication).</p>
        <p>Powered by Dynamsoft Barcode Reader.</p>
        <p>Github repo: <a href="javascript:void()" @click="gitrepoClicked">https://github.com/tony-xlh/QRTransfer</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { settingsOutline } from 'ionicons/icons';
const router = useIonRouter();
const gitrepoClicked = () => {
  if (Capacitor.isNativePlatform()) {
    Share.share({
      text: "https://github.com/tony-xlh/QRTransfer",
    });
  }else{
    window.open("https://github.com/tony-xlh/QRTransfer","_blank");
  }
}

const goToSettingsPage = () => {
  router.push("/settings");
}
</script>
<style scoped>
.about {
  height: 95%;
  padding-top: 5%;
  padding-left: 2em;
  padding-right: 2em;
}
.about h2 {
  text-align: center;
}
</style>
