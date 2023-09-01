import localforage from "localforage"

export interface ScannedFile {
  dataURL:string
  filename:string
  mimeType:string
  filesize:number
  date:Date
}

export class FilesManager {
  private store:LocalForage;
  constructor(){
    this.store = localforage.createInstance({
      name: "files"
    });
  }
  
  async saveFile(file:ScannedFile) {
    await this.store.setItem(file.date.getTime().toString(),JSON.stringify(file));
  }

  async deleteFile(key:string) {
    await this.store.removeItem(key);
  }

  async getKeys(){
    return await this.store.keys();
  }

  async getFile(key:string){
    let jsonStr:string|null = await this.store.getItem(key);
    if (jsonStr) {
      let file:ScannedFile = JSON.parse(jsonStr);
      return file;
    }else{
      return null;
    }
  }

  async listFiles(){
    let files:ScannedFile[] = [];
    let keys = await this.getKeys();
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let file = await this.getFile(key);
      if (file) {
        files.push(file);
      }
    }
    return files;
  }
}