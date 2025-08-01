import { useState } from "react";
import { View, Modal, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useApi } from "@api/client";

export default function BarcodeScanner() {
  const [open, setOpen] = useState(false);
  const api = useApi();

  const handleBarCodeScanned = async ({ data }) => {
    const res = await api.get(`/foods?barcode=${data}`).catch(() => null);
    if (!res) {
      // open add-food flow
    }
    setOpen(false);
  };

  return (
    <>
      <Button title="Scan barcode" onPress={() => setOpen(true)} />
      <Modal visible={open} animationType="slide">
        <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={{ flex: 1 }} />
        <Button title="Close" onPress={() => setOpen(false)} />
      </Modal>
    </>
  );
}
