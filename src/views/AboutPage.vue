<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">About</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="about">
        <h2>QR Transfer</h2>
        <p>This is a QR code scanner which can be used to transfer data between devices via QR codes.</p>
        <p>Powered by Dynamsoft Barcode Reader.</p>
        <p>Github repo: <a href="javascript:void()" @click="gitrepoClicked">https://github.com/tony-xlh/QRTransfer</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
const gitrepoClicked = () => {
  if (Capacitor.isNativePlatform()) {
    Share.share({
      text: "https://github.com/tony-xlh/QRTransfer",
    });
  }else{
    window.open("https://github.com/tony-xlh/QRTransfer","_blank");
  }
}
</script>
<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 5%;
  padding-left: 2em;
  padding-right: 2em;
}
</style>
