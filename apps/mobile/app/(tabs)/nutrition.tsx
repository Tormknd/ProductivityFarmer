import { View, Text, Button } from 'react-native';

export default function Nutrition() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
        Nutrition
      </Text>
      
      <View style={{ marginTop: 20 }}>
        <Button title="Scan Barcode (Coming Soon)" onPress={() => {}} />
      </View>
      
      <Text style={{ color: '#FFFFFF', marginTop: 20 }}>
        Nutrition tracking coming soon!
      </Text>
    </View>
  );
} 