import React, { Component } from "react";
import { View } from "react-native";
import { QRCode, Canvas } from "easyqrcode-react-native";

class QrPage extends Component {
  generateQRCode = (canvas) => {
    if (canvas !== null) {
       const { base64 } = this.props; // 💡 Access the base64 image
      // QRCode options
      var options = {
        text: "www.google.com",
        backgroundImage: "",
        dotScale: 0.3,
        // colorDark: "#FF0000",   // QR dot color (red)
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
        backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1.
        autoColor: true, // Automatic color adjustment(for data block)
        autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
        autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
      };
      // Create QRCode Object
      var qrCode = new QRCode(canvas, options);
    }
  };

  render() {
    return (
      <View className="h-screen w-screen justify-center items-center">
        {/* 2. QRCode Canvas  */}
        <Canvas ref={this.generateQRCode} />
      </View>
    );
  }
}
export default QrPage;
