<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!--<QRCodeScanner
        license="DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        :layout="layout"
        @onScanned="onScanned"
        @onPlayed="onPlayed"
      ></QRCodeScanner>-->
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
      <div class="QRCode">
        <QRCode v-if="!isSender"
          :data="filesQR"
        ></QRCode>
        <AnimatedQRCode v-if="isSender"
          :unit8Array="unit8Array"
          :filename="filename"
          :type="type"
          :chunkSize="chunkSize"
          :interval="QRCodeInterval"
        ></AnimatedQRCode>
      </div>
      <div class="status">
        <button @click="pickAFile">Pick a file</button>
      </div>
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
import AnimatedQRCode from '@/components/AnimatedQRCode.vue';
import { FilePicker } from '@capawesome/capacitor-file-picker';

const viewBox = ref("0 0 1280 720");
const barcodeResults = ref([] as TextResult[]);
const filesQR = ref("Dynamsoft");
const isSender = ref(false);
const svg = ref<HTMLElement|null>(null);
const unit8Array = ref<Uint8Array>();
const filename = ref("");
const type = ref("");
const chunkSize = ref(2000);
const QRCodeInterval = ref(250);
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
    filesQR.value = "Dynamsoftasd asd ";
  }
  alignLayout(layout.value);
})

const pickAFile = async () => {
  const result = await FilePicker.pickFiles({
    readData:true
  });
  if (result.files.length>0) {
    filename.value = result.files[0].name;
    type.value = result.files[0].mimeType;
    unit8Array.value = base64ToUnit8Array(result.files[0].data!);
  }
}

const base64ToUnit8Array = (base64String:string) => {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

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
