# QRTransfer

This is an Ionic version of the [AnimatedQRCodeReader](https://github.com/xulihang/AnimatedQRCodeReader).

[Online demo](https://delightful-sunflower-f32a01.netlify.app/)

The QR code scanner can be used to transfer data between devices via QR codes.

The sender separates the data of a file into chunks, stores them in QR codes, and displays the QR codes in a loop. The receiver can scan the QR codes to get the data. The receiver can tell the sender which QR codes have been scanned so that the sender will skip them (two-way communication).

It is powered by Dynamsoft Barcode Reader. You may need to [apply for a license](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr) to use it.

Demo videos:

1. Receive a 12.9KB image.
   

   

https://github.com/tony-xlh/QRTransfer/assets/5462205/ac2518fa-ecba-4d11-93ff-f42832d3b1b4


   
2. Receive a 72.4KB image.

   


https://github.com/tony-xlh/QRTransfer/assets/5462205/e5f13785-fc74-4f04-84d4-a6cef5ae7b08


   

   
