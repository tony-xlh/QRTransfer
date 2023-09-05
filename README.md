# QRTransfer

This is an Ionic version of the [AnimatedQRCodeReader](https://github.com/xulihang/AnimatedQRCodeReader).

[Online demo](https://delightful-sunflower-f32a01.netlify.app/)

The QR code scanner can be used to transfer data between devices via QR codes.

The sender separates the data of a file into chunks, stores them in QR codes, and displays the QR codes in a loop. The receiver can scan the QR codes to get the data. The receiver can tell the sender which QR codes have been scanned so that the sender will skip them (two-way communication).

It is powered by Dynamsoft Barcode Reader. You may need to [apply for a license](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr) to use it.

Demo videos:

1. Receive a 12.9KB image.
   
   https://github.com/tony-xlh/QRTransfer/releases/download/v1.0.0/demo.mp4
   
2. Receive a 72.4KB image.

   https://github.com/tony-xlh/QRTransfer/releases/download/v1.0.0/large_file_demo.mp4

   
