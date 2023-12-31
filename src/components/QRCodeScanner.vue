<template>
  <div v-if="!initialized">Initializing...</div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { DBR, Options, ScanRegion, ScanResult } from "capacitor-plugin-dynamsoft-barcode-reader";
import { PluginListenerHandle } from "@capacitor/core";

const props = defineProps<{
  license?: string
  scanRegion?: ScanRegion
  dceLicense?: string
  active?: boolean
  desiredCamera?: string
  interval?: number
  torchOn?: boolean
  runtimeSettings?: string
  layout:{
        top: string;
        left: string;
        width: string;
        height: string;
    }
}>()
const emit = defineEmits<{
  (e: 'onScanned',result:ScanResult): void
  (e: 'onPlayed',resolution:string): void
}>();
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
  if (props.dceLicense) {
    options.dceLicense = props.dceLicense;
  }
  if (props.layout) {
    setLayout();
  }
  let result = await DBR.initialize(options);
  if (result.success === true) {
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

    onPlayedListener = await DBR.addListener("onPlayed", async (result:{resolution:string}) => {
      currentWidth = parseInt(result.resolution.split("x")[0]);
      currentHeight = parseInt(result.resolution.split("x")[1]);
      setLayout();
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

    if (props.scanRegion){
      await DBR.setScanRegion(props.scanRegion);
    }

    await selectDesiredCamera();
    if (props.active === true) {
      await DBR.startScan();
    }
    initialized.value = true;
    console.log("QRCodeScanner mounted");
  }
});

const setLayout = async () => {
  if (props.layout) {
    await DBR.setLayout({
      top:props.layout.top,
      left:props.layout.left,
      width:props.layout.width,
      height:props.layout.height
    })
    if (props.scanRegion) {
      await DBR.setScanRegion(props.scanRegion);
    }
  }
}

onBeforeUnmount(async () => {
  if (frameReadListener) {
    frameReadListener.remove();
  }
  if (onPlayedListener) {
    onPlayedListener.remove();
  }
  await DBR.stopScan();
  console.log("QRCodeScanner unmount");
});

watch(() => props.torchOn, (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal === true) {
      DBR.toggleTorch({on:true});
    }else{
      DBR.toggleTorch({on:false});
    }
  }
});

watch(() => props.interval, (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal) {
      DBR.setInterval({interval:newVal});
    }
  }
});

watch(() => props.layout, (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal) {
      setLayout();
    }
  }
});

watch(() => props.active, (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal === true) {
      DBR.startScan();
    }else if (newVal === false){
      DBR.stopScan();
    }
  }
});

watch(() => props.desiredCamera, async (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal) {
      selectDesiredCamera();
    }
  }
});

const selectDesiredCamera = async () => {
  let camerasResult = await DBR.getAllCameras();
  if (camerasResult.cameras) {
    for (let index = 0; index < camerasResult.cameras.length; index++) {
      const cameraID = camerasResult.cameras[index];
      let desiredCameraString = "founder"; //the USB camera's name of the developer
      if (props.desiredCamera) {
        desiredCameraString = props.desiredCamera;
      }
      if (cameraID.toLowerCase().indexOf(desiredCameraString) != -1 ){
        await DBR.selectCamera({cameraID:cameraID});
        break;
      }
    }
  }
}

watch(() => props.scanRegion, async (newVal, oldVal) => {
  if (initialized.value) {
    if (newVal) {
      await DBR.setScanRegion(newVal);
    }else{
      await DBR.setScanRegion({left:0,top:0,right:100,bottom:100,measuredByPercentage:1});
    }
  }
});
</script>

<style scoped>

</style>