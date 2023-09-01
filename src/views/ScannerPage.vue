<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <QRCodeScanner
        license="DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        :layout="layout"
        :interval="scanInterval"
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
      <div class="lower">
        <div class="QRCode">
          <AnimatedQRCode v-if="isSender && selectedFile"
            :file="selectedFile"
            :chunkSize="chunkSize"
            :interval="QRCodeInterval"
          ></AnimatedQRCode>
          <QRCode v-if="!isSender"
            :data="filesQR"
          ></QRCode>
        </div>
      </div>
      <div class="status">
        <div v-if="isSender">
          <ion-button size="small" @click="pickAFile">Pick a file</ion-button>
          <ion-input label="Chunk size:"  @change="chunkSizeChanged($event.target.value)" :value="chunkSize"></ion-input>
          <ion-input label="Interval:" @change="intervalChanged($event.target.value)" :value="QRCodeInterval"></ion-input>
        </div>
        <div class="scanningStatus" v-if="!isSender">
          <pre>{{ scanningStatus }}</pre>
          <div>{{ scanned }}</div>
        </div>
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
import AnimatedQRCode, { SelectedFile } from '@/components/AnimatedQRCode.vue';
import { FilePicker } from '@capawesome/capacitor-file-picker';

const viewBox = ref("0 0 1280 720");
const barcodeResults = ref([] as TextResult[]);
const filesQR = ref("Dynamsoft");
const isSender = ref(false);
const svg = ref<HTMLElement|null>(null);
const selectedFile = ref<SelectedFile>();
const chunkSize = ref(2000);
const scanInterval = ref(100);
const QRCodeInterval = ref(250);
const layout = ref({top:'0px',left:'75%',width:'25%',height:'150px'});
const scanningStatus = ref("");
const scanned = ref("");
let fullSizeCamera = false;
let frameHeight = 720;
let frameWidth = 1280;
let startTime = 0;
let framesRead = 0;
let successNum =0;
let codeResults:any = {};
let total = 0;

onMounted(async () => {
  if (getUrlParam("sender") === "true") {
    isSender.value = true;
    scanInterval.value = 10000;
    console.log("is sender");
  }else{
    console.log("not sender")
    isSender.value = false;
    filesQR.value = "Dynamsoftasd asd ";
  }
  alignLayout(layout.value);
})

const intervalChanged = (newVal:number) => {
  QRCodeInterval.value = newVal;
}

const chunkSizeChanged = (newVal:number) => {
  chunkSize.value = newVal;
}

const pickAFile = async () => {
  const result = await FilePicker.pickFiles({
    readData:true
  });
  if (result.files.length>0) {
    console.log("picked");
    selectedFile.value = {
      unit8Array:base64ToUnit8Array(result.files[0].data!),
      filename:result.files[0].name,
      type:result.files[0].mimeType
    }
  }
}

const base64ToUnit8Array = (base64String:string) => {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const base64ToBytesArray = (base64String:string) => {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  let rawData = window.atob(base64);
  let outputArray = [];
  for (let i = 0; i < rawData.length; ++i) {
    outputArray.push(rawData.charCodeAt(i));
  }
  return outputArray;
};

const svgClicked = () => {
  let style = {top:'0px',left:'0px',width:'100%',height:'100%'};
  if (fullSizeCamera) {
    style = {top:'0px',left:'75%',width:'25%',height:'150px'};
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
  framesRead = framesRead + 1;
  if (result.results.length > 0) {
    successNum = successNum + 1;
    processRead(result.results[0]);
  };
  let endTime = new Date().getTime();
  updateStatistics(endTime-startTime);
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

const updateStatistics = (timeElapsed:number) => {
  let statistics = "";
  statistics = "elapsed time: " + (timeElapsed)/1000 +"s";
  statistics = statistics +"\ntotal frame number: " + framesRead;
  statistics = statistics +"\nsuccessful number: " + successNum;
  statistics = statistics +"\nsuccess fps: " + (successNum/(timeElapsed/1000)).toFixed(2);
  statistics = statistics +"\nprogress: " + Object.keys(codeResults).length + "/" + total;
  scanningStatus.value = statistics;
}

const processRead = (result:TextResult) => {
  let text = result["barcodeText"];
  try {
    let meta = text.split("|")[0];
    let totalOfThisOne = parseInt(meta.split("/")[1]);
    if (total!=0){
      if (total != totalOfThisOne){
        total = totalOfThisOne;
        codeResults={};
        return;
      }
    }
    
    total = totalOfThisOne;
    let index = parseInt(meta.split("/")[0]);
    codeResults[index]=result;
    if (Object.keys(codeResults).length === total){
      onCompleted();
    }
  } catch(error) {
    console.log(error);
  }
}

const onCompleted = () => {
  let endTime = new Date().getTime();
  let timeElapsed = endTime - startTime;
  updateStatistics(timeElapsed);
  showResult(timeElapsed);
}

const showResult = async (timeElapsed:number) => {
  let jointData:number[] = [];
  let mimeType = "";
  let filename = "";
  for (let i=0;i<Object.keys(codeResults).length;i++){
    let index = i+1;
    let result:TextResult = codeResults[index];
    let bytes = base64ToBytesArray(result.barcodeBytesBase64);
    let text = result.barcodeText;
    let data;
    if (index == 1){
      filename = text.split("|")[1]; //the first one contains filename|image/webp|data
      mimeType = text.split("|")[2];
      let firstSeparatorIndex = text.indexOf("|");
      let secondSeparatorIndex = text.indexOf("|",firstSeparatorIndex+1);
      let dataStart = text.indexOf("|",secondSeparatorIndex+1)+1;
      data = bytes.slice(dataStart,bytes.length);
    }else{
      let dataStart = text.indexOf("|")+1;
      data = bytes.slice(dataStart,bytes.length);
    }
    jointData = jointData.concat(data);
  }
  let dataURL:string = await BytesAsDataURL(jointData,mimeType);
  scanned.value = dataURL;
}

//https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
const BytesAsDataURL = async (data:number[],mimeType:string) => {
  // Use a FileReader to generate a base64 data URI
  const dataUrl:string = await new Promise((r) => {
    const reader = new FileReader()
    reader.onload = () => r(reader.result as string)
    let array = ConvertToUInt8Array(data);
    let blob = new Blob([array],{type: mimeType});
    reader.readAsDataURL(blob)
  })
  /*
  The result looks like 
  "data:application/octet-stream;base64,<your base64 data>", 
  so we split off the beginning:
  */
  return dataUrl;
}

const ConvertToUInt8Array = (data:number[]) => {
  let array = new Uint8Array(data.length);
  for (let i=0;i<data.length;i++){
    array[i] = data[i];
  }
  return array;
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
  width: 440px;
  height: 440px;
}

.status {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 75%;
  height: 150px;
  background: white;
}

.lower {
  position: absolute;
  top: 150px;
  left: 0px;
  width: 100%;
  height: calc(100vh - 150px);
  background: white;
}

</style>
