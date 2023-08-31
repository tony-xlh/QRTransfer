<template>
  <div ref="placeHolder"></div>
</template>

<script lang="ts" setup>
import qrcode from "qrcode-generator";
import { onMounted, ref, watch } from "vue";
const placeHolder = ref<HTMLElement|null>(null);
const props = defineProps(['data','mode','typeNumber','errorCorrectionLevel']);
const originalFunction = (qrcode as any).stringToBytes;

const toggleBytesMode = (on:boolean) => {
  if (on) {
    (qrcode as any).stringToBytes = function(data:any) { return data; };
  }else{
    (qrcode as any).stringToBytes = originalFunction;
  }
}


onMounted(async () => {
  if (props.mode === "on") {
    toggleBytesMode(true);
  }else{
    toggleBytesMode(false);
  }
  makeQR();
})

const makeQR = () => {
  if (placeHolder.value) {
    var typeNumber:TypeNumber = props.typeNumber ?? 0;
    var errorCorrectionLevel:ErrorCorrectionLevel = props.errorCorrectionLevel ?? 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(props.data ?? "");
    qr.make();
    placeHolder.value.innerHTML = qr.createSvgTag();
    placeHolder.value.getElementsByTagName("svg")[0].style.width = "100%";
    placeHolder.value.getElementsByTagName("svg")[0].style.height = "100%";
  }
}

watch(() => props.mode, (newVal, oldVal) => {
  if (newVal === "on") {
    toggleBytesMode(true);
  }else{
    toggleBytesMode(false);
  }
  makeQR();
});

watch(() => props.data, (newVal, oldVal) => {
  if (newVal) {
    makeQR();
  }
});

watch(() => props.typeNumber, (newVal, oldVal) => {
  if (newVal) {
    makeQR();
  }
});

watch(() => props.errorCorrectionLevel, (newVal, oldVal) => {
  if (newVal) {
    makeQR();
  }
});
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>