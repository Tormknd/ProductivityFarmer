import { View, Text } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
        Dashboard
      </Text>
      
      {user ? (
        <Text style={{ color: '#FFFFFF', marginTop: 10, fontSize: 18 }}>
          Welcome back, {user.name}! 👋
        </Text>
      ) : (
        <Text style={{ color: '#FFFFFF', marginTop: 10 }}>
          Welcome to ProductivityLeveling!
        </Text>
      )}
    </View>
  );
} 