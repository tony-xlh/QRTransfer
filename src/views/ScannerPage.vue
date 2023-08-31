<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="QRCode">
        <QRCode></QRCode>
      </div>
      
      <QRCodeScanner
        license="DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        :layout="layout"
        @onScanned="onScanned"
        @onPlayed="onPlayed"
      ></QRCodeScanner>
      <svg
        ref="svg"
        :viewBox="viewBox"
        @click="svgClicked"
        preserveAspectRatio="xMidYMid slice"
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
import QRCode from '@/components/QRCode.vue';
import { IonPage, IonContent, useIonRouter } from '@ionic/vue';
import { ScanResult, TextResult } from 'capacitor-plugin-dynamsoft-barcode-reader';
import { onMounted, ref } from 'vue';
import {getUrlParam } from '../utils';
const viewBox = ref("0 0 1280 720");
const barcodeResults = ref([] as TextResult[]);
const isSender = ref(false);
const svg = ref<HTMLElement|null>(null);
const layout = ref({top:'0px',left:'75%',width:'25%',height:'200px'});
let fullSizeCamera = false;
let frameHeight = 720;
let frameWidth = 1280;

onMounted(async () => {
  if (getUrlParam("sender") === "true") {
    isSender.value = true;
    console.log("is sender");
  }else{
    console.log("not sender")
  }
  alignLayout(layout.value);
})

const svgClicked = () => {
  let style = {top:'0px',left:'0px',width:'100%',height:'100%'};
  if (fullSizeCamera) {
    style = {top:'0px',left:'75%',width:'25%',height:'200px'};
  }
  fullSizeCamera = ! fullSizeCamera;
  layout.value = style;
  alignLayout(style);
}

const alignLayout = (style:any) => {
  if (svg.value) {
    svg.value.style.top = style.top;
    svg.value.style.left = style.left;
    svg.value.style.width = style.width;
    svg.value.style.height = style.height;
  }
}

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
.barcode-polygon {
  fill:rgba(85,240,40,0.5);
  stroke:green;
  stroke-width:1;
}

.overlay {
   top: 0;
   left: 0;
   position: absolute;
   width: 100%;
   height: 100%;
   z-index: 998;
 }

.QRCode {
  width: 512px;
  height: 512px;
}
</style>
