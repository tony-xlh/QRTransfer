<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Transfer via QR code</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          Click the buttons to send or receive a file via QR code.
          <div class="buttons">
            <ion-button @click="sendFile">Send a File</ion-button>
            <ion-button @click="recieveFile">Receive a File</ion-button>
          </div>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';
const router = useIonRouter();

const sendFile = () => {
  router.push("/scanner?sender=true");
}

const recieveFile = () => {
  router.push("/scanner?sender=false");
}

</script>

<style>
.buttons {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

.buttons ion-button {
  width: 200px;
}
</style>
