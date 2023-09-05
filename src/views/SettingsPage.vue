<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-button size="small" @click="save" slot="end" fill="clear">
          Save
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-divider>License</ion-item-divider>
        <ion-item>
          <ion-input v-model="license"></ion-input>
          <ion-button @click="getLicense">Get a license</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonList, IonItemDivider, IonItem,IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

const router = useIonRouter();
const license = ref("");

onMounted(() => {
  let storedLicense = localStorage.getItem("license");
  if (storedLicense) {
    license.value = storedLicense;
  }
})

const save = () => {
  localStorage.setItem("license",license.value);
  router.back();
}

const getLicense = () => {
  if (Capacitor.isNativePlatform()) {
    Share.share({
      text: "https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=ionic",
    });
  }else{
    window.open("https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=ionic","_blank");
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
