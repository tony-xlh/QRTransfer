<template>
  <QRCode v-if="chunk != null"
    :data="chunk"
    byteMode="on"
  ></QRCode>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import QRCode from "./QRCode.vue"

export interface SelectedFile {
  unit8Array: Uint8Array,
  filename: string,
  type: string,
}
const props = defineProps<{
  file:SelectedFile
  chunkSize: number
  interval: number
  scannedIndex?: number[]
}>()

const emit = defineEmits<{
  (e: 'onAnimated',index:number,total:number): void
}>();

const chunk = ref<any>(null);
let chunks:any[] = [];
let currentIndex = 0;

onMounted(async () => {
  if (props.file) {
    loadArrayBufferToChunks(props.file.unit8Array,props.file.filename,props.file.type)
    if (props.scannedIndex) {
      filterOutScannedChunks(props.scannedIndex);
    }
    showAnimatedQRCode();
  }
})

const loadArrayBufferToChunks = (bytes:Uint8Array,filename:string,type:string) => {
  console.log(bytes);
  var data = concatTypedArrays(stringToBytes(encodeURIComponent(filename)+"|"+type+"|"),bytes)
  var chunkSize = props.chunkSize ?? 2000;
  console.log("chunk size:"+chunkSize);
  var num = Math.ceil(data.length / chunkSize)
  chunks = [];
  for (var i=0;i<num;i++){
    var start = i*chunkSize;
    var chunk = data.slice(start,start+chunkSize);
    var meta = (i+1)+"/"+num+"|";
    chunk = concatTypedArrays(stringToBytes(meta),chunk);
    chunks.push(chunk);
  }
  console.log(chunks);
}

const showAnimatedQRCode = () => {
  chunk.value = chunks[currentIndex];
  emit("onAnimated",currentIndex,chunks.length);
  currentIndex = currentIndex + 1
  if (currentIndex >= chunks.length){
    currentIndex = 0;
  }
  setTimeout(showAnimatedQRCode,props.interval ?? 1000);
}

const stringToBytes = (s:any) => {
  var bytes = [];
  for (var i = 0; i < s.length; i += 1) {
    var c = s.charCodeAt(i);
    bytes.push(c & 0xff);
  }
  return bytes;
}

//https://stackoverflow.com/questions/33702838/how-to-append-bytes-multi-bytes-and-buffer-to-arraybuffer-in-javascript
const concatTypedArrays = (a:any, b:any) => { //common array + unint8 array
  var newLength = a.length + b.byteLength;
  console.log(newLength);
  var c = new Uint8Array(newLength);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

watch(() => props.file, (newVal, oldVal) => {
  if (newVal) {
    loadArrayBufferToChunks(newVal.unit8Array,newVal.filename,newVal.type);
    showAnimatedQRCode();
  }
});

watch(() => props.scannedIndex, (newVal, oldVal) => {
  if (newVal) {
    filterOutScannedChunks(newVal);
  }
});

const filterOutScannedChunks = (scannedIndex:number[]) => {
  scannedIndex.sort((a,b) => b - a); //descend
  for (let i = 0; i < scannedIndex.length; i++) {
    const index = scannedIndex[i];
    chunks.splice(index,1);
  }
}

</script>

<style scoped>
</style>
