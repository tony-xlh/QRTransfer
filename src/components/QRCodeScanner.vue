<template>
  <div v-if="!initialized">Initializing...</div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { DBR, Options, ScanResult } from "capacitor-plugin-dynamsoft-barcode-reader";
import { PluginListenerHandle } from "@capacitor/core";

const props = defineProps(['license','dceLicense','interval','torchOn','runtimeSettings']);
const emit = defineEmits(['onScanned','onPlayed']);
const initialized = ref(false);
let currentHeight = 0;
let currentWidth = 0;
let frameReadListener:PluginListenerHandle|undefined;
let onPlayedListener:PluginListenerHandle|undefined;

const handleRotation = (result:any, orientation: string, rotation:number) => {
   let width,height;
   if (orientation == "portrait") {
     width = currentHeight;
     height = currentWidth;
   }else{
     width = currentWidth;
     height = currentHeight;
   }
   for (let i = 1; i < 5; i++) {
     let x = result["x"+i];
     let y = result["y"+i];
     let rotatedX;
     let rotatedY;
            
     switch (rotation) {
       case 0:
         rotatedX = x;
         rotatedY = y;
         break;
       case 90:
         rotatedX = width - y;
         rotatedY = x;
         break;
       case 180:
         rotatedX = width - x;
         rotatedY = height - y;
         break;
       case 270:
         rotatedX = height - y;
         rotatedY = width - x;
         break;
       default:
         rotatedX = x;
         rotatedY = y;
     }
     result["x"+i] = rotatedX;
     result["y"+i] = rotatedY;
   }
 }


onMounted(async () => {
  console.log(props);
  let options:Options = {};
  if (props.license) {
    options.license = props.license;
  }
  if (props.dceLicense) {
    options.dceLicense = props.dceLicense;
  }
  let result = await DBR.initialize(options); // To use your license: DBR.initialize({license: <your license>})
  console.log("QRCodeScanner mounted");
  if (result.success === true) {
    initialized.value = true;
    if (frameReadListener) {
      frameReadListener.remove();
    }
    if (onPlayedListener) {
      onPlayedListener.remove();
    }
    frameReadListener = await DBR.addListener('onFrameRead', (scanResult:ScanResult) => {
      for (let index = 0; index < scanResult.results.length; index++) {
        const result = scanResult.results[index];
        if (scanResult.deviceOrientation && scanResult.frameOrientation) {
          handleRotation(result,scanResult.deviceOrientation,scanResult.frameOrientation);
        }
      }
      emit("onScanned",scanResult);
    });

    onPlayedListener = await DBR.addListener("onPlayed", (result:{resolution:string}) => {
      currentWidth = parseInt(result.resolution.split("x")[0]);
      currentHeight = parseInt(result.resolution.split("x")[1]);
      emit("onPlayed",result.resolution);
    });

    if (props.runtimeSettings) {
      console.log("update runtime settings");
      console.log(props.runtimeSettings);
      await DBR.initRuntimeSettingsWithString({template:props.runtimeSettings});
    }

    if (props.interval) {
      await DBR.setInterval({interval:props.interval});
    }

    let camerasResult = await DBR.getAllCameras();
    if (camerasResult.cameras) {
      for (let index = 0; index < camerasResult.cameras.length; index++) {
        const cameraID = camerasResult.cameras[index];
        if (cameraID.toLowerCase().indexOf("founder") != -1 ){
          console.log(cameraID)
          console.log("selct founder camera"); //the USB camera's name of the developer
          let selectionResult = await DBR.selectCamera({cameraID:cameraID});
          console.log(selectionResult);
          break;
        }
      }
    }

    await DBR.startScan();
  }
});

onBeforeUnmount(() => {
  if (frameReadListener) {
    frameReadListener.remove();
  }
  if (onPlayedListener) {
    onPlayedListener.remove();
  }
  DBR.stopScan();
  console.log("QRCodeScanner unmount");
});

watch(() => props.torchOn, (newVal, oldVal) => {
  if (newVal === true) {
    DBR.toggleTorch({on:true});
  }else{
    DBR.toggleTorch({on:false});
  }
});

watch(() => props.interval, (newVal, oldVal) => {
  if (newVal) {
    DBR.setInterval({interval:newVal});
  }
});

</script>

<style scoped>

</style>