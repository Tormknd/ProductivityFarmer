import { useState } from "react";
import { View, Modal, Button, Text, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useApi } from "../api/client";
import { useFoodByBarcode } from "../api/foods";
import { formatNutritionValue } from "../lib/nutrition";

export default function BarcodeScanner() {
  const [open, setOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const api = useApi();
  
  const { data: food, isLoading } = useFoodByBarcode(scannedBarcode || '');

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScannedBarcode(data);
    setOpen(false);
    
    // Check if food exists
    try {
      const res = await api.get(`/foods/barcode/${data}`);
      if (res.data) {
        Alert.alert('Food Found!', `${res.data.name} - ${formatNutritionValue(res.data.kcal)} kcal`);
      }
    } catch (error) {
      Alert.alert('Food Not Found', 'This barcode is not in our database. Would you like to add it?');
    }
  };

  return (
    <>
      <Button title="Scan Barcode" onPress={() => setOpen(true)} />
      <Modal visible={open} animationType="slide">
        <View style={{ flex: 1 }}>
          <BarCodeScanner 
            onBarCodeScanned={handleBarCodeScanned} 
            style={{ flex: 1 }} 
          />
          <View style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: '#1E1E1E',
            padding: 20
          }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: 10 }}>
              Point camera at barcode
            </Text>
            <Button title="Close" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
} 