<template>
  <ion-page>
    <ion-content :fullscreen="true">
       <QRCodeScanner
        license="DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        @onScanned="onScanned"
        @onPlayed="onPlayed"
       ></QRCodeScanner>
       <svg
        :viewBox="viewBox"
        class="overlay"
      >
        <polygon v-bind:key="'polygon'+index" v-for="(barcodeResult,index) in barcodeResults"
          :points="getPointsData(barcodeResult)"
          class="barcode-polygon"
        />
    </svg>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner.vue';
import { IonPage, IonContent, useIonRouter } from '@ionic/vue';
import { ScanResult, TextResult } from 'capacitor-plugin-dynamsoft-barcode-reader';
import { onMounted, ref } from 'vue';
import {getUrlParam } from '../utils';
const viewBox = ref("0 0 1280 720");
const barcodeResults = ref([] as TextResult[]);
const isSender = ref(false);
let frameHeight = 720;
let frameWidth = 1280;

onMounted(async () => {
  if (getUrlParam("sender") === "true") {
    isSender.value = true;
    console.log("is sender");
  }else{
    console.log("not sender")
  }
})

const onScanned = (result:ScanResult) => {
  console.log("onScanned");
  console.log(result);
  if (result.deviceOrientation === "portrait") {
    viewBox.value = "0 0 " + frameHeight + " " + frameWidth;
  }else{
    viewBox.value = "0 0 " + frameWidth  + " " + frameHeight;
  }
  barcodeResults.value = result.results;
}

const onPlayed = (resolution:string) => {
  const width = resolution.split("x")[0];
  const height = resolution.split("x")[1];
  frameWidth = parseInt(width);
  frameHeight = parseInt(height);
}

const getPointsData = (tr:TextResult) => {
  let pointsData = tr.x1 + "," + tr.y1 + " ";
  pointsData = pointsData + tr.x2+ "," + tr.y2 + " ";
  pointsData = pointsData + tr.x3+ "," + tr.y3 + " ";
  pointsData = pointsData + tr.x4+ "," + tr.y4;
  return pointsData;
}
</script>

<style>
</style>
