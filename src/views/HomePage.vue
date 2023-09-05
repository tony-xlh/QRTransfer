<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
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
let licenseInitialized = false;

onMounted(async () => {
  await DBR.requestCameraPermission();
  try {
    let license = localStorage.getItem("license") ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
    await DBR.initLicense({license:license});
    licenseInitialized = true;
  } catch (error) {
    alert("License invalid. Please check your license");
    router.push("/settings");
  }
});

const sendFile = () => {
  if (!licenseInitialized) {
    alert("Please wait for the initialization of the license");
  }else{
    router.push("/scanner?sender=true");
  }
}

const recieveFile = () => {
  if (!licenseInitialized) {
    alert("Please wait for the initialization of the license");
  }else{
    router.push("/scanner?sender=false");
  }
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
