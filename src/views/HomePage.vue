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
import { IonButton, IonCardTitle, IonCard, IonCardHeader, IonCardContent, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';
import { DBR } from 'capacitor-plugin-dynamsoft-barcode-reader';
import { onMounted } from 'vue';
const router = useIonRouter();

onMounted(async () => {
  await DBR.requestCameraPermission();
  try {
    await DBR.initLicense({license:"DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="});
  } catch (error) {
    alert("License invalid");
  }
});

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
