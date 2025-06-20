import React from "react";
import QRCode from "react-qr-code";

const AdminQrCode = () => {
  const qrData = {
    type: "attendance-check-in",
    timestamp: new Date().toISOString(),
  };

  return (
    <div>
      <h3>QR Chấm công</h3>
      <QRCode value={JSON.stringify(qrData)} />
    </div>
  );
};

export default AdminQrCode;
