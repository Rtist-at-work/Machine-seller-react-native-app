import React, { useEffect, useRef, useState } from "react";
import QRCode from "easyqrcodejs";

const QrWeb = ({ base64, link }) => {
  const qrRef = useRef(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [qrInstance, setQrInstance] = useState(null); // store the QR instance

  useEffect(() => {
    if (base64) {
      setBgImageUrl(`data:image/png;base64,${base64}`);
    }
  }, [base64]);

  useEffect(() => {
    if (qrRef.current && bgImageUrl) {
      qrRef.current.innerHTML = ""; // Clear previous

      const qr = new QRCode(qrRef.current, {
        text: link,
        backgroundImage: bgImageUrl,
        backgroundImageAlpha: 1,
        colorLight: "#ffffff",
        autoColor: true,
        correctLevel: QRCode.CorrectLevel.H,
        dotScale: 0.2,
        dotScaleAI: 0.1,
        dotScaleAO: 0.1,
        autoColorLight: "rgba(255, 255, 255, .7)",
        quietZoneColor: "rgba(0,0,0,0)",
        width: 300,
        height: 300,
        logo: "",
        logoWidth: 100,
        logoHeight: 100,
        logoBackgroundTransparent: true,
      });

      setQrInstance(qr);
    }
  }, [bgImageUrl]);

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qr-code.png";
      link.click();
    } else {
      alert("QR code not available for download.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <div ref={qrRef} style={{ marginTop: 20 }} />
      <button
        onClick={handleDownload}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          backgroundColor: "#7C3AED",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Download QR
      </button>
    </div>
  );
};

export default QrWeb;
