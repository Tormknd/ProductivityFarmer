import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';

export default function Settings() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
            console.log("Navigating to login after logout");
            router.replace("/auth/login");
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700' }}>
        Settings
      </Text>
      
      <View style={{ marginTop: 30 }}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ 
            backgroundColor: '#FF5252', 
            padding: 16, 
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 