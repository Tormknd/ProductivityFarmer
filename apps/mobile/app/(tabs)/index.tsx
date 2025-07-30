import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/api/xp';
import { useTasks } from '../../src/api/tasks';
import { calcLevel } from '../../src/lib/xp';
import XPBar from '../../src/components/XPBar';

export default function Dashboard() {
  const { user: authUser, token } = useAuth();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();

  const recentTasks = tasks?.slice(0, 3) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];
  const pendingTasks = tasks?.filter(task => !task.completed) || [];
  
  // Use API user data if available, otherwise fall back to auth user
  const currentUser = user || authUser;
  const { level, nextLevelXp } = currentUser ? calcLevel(currentUser.xp || 0) : { level: 0, nextLevelXp: 100 };

  console.log('Dashboard Debug:', {
    authUser: !!authUser,
    user: user,
    userLoading,
    userError,
    tasks: tasks?.length,
    tasksLoading,
    tasksError,
    level,
    nextLevelXp,
    token: !!token
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Dashboard
        </Text>
        
        {token ? (
          <>
            {/* User Info */}
            <View style={{ 
              backgroundColor: '#1E1E1E', 
              padding: 20, 
              borderRadius: 16, 
              marginBottom: 20 
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                Welcome back, {currentUser?.name || 'User'}! 👋
              </Text>
              
              {/* Force show debug info */}
              <Text style={{ color: '#FF5252', fontSize: 14, marginTop: 8 }}>
                DEBUG: Token={!!token}, AuthUser={!!authUser}, APIUser={!!user}
              </Text>
              <Text style={{ color: '#FF5252', fontSize: 14, marginTop: 4 }}>
                UserLoading={userLoading}, TasksLoading={tasksLoading}
              </Text>
              {userError && (
                <Text style={{ color: '#FF5252', fontSize: 14, marginTop: 4 }}>
                  User Error: {userError.message}
                </Text>
              )}
              {tasksError && (
                <Text style={{ color: '#FF5252', fontSize: 14, marginTop: 4 }}>
                  Tasks Error: {tasksError.message}
                </Text>
              )}
              
              {/* Force show user data */}
              <Text style={{ color: '#FFD54F', fontSize: 16, marginTop: 8 }}>
                Level {level + 1} • {currentUser?.xp || 0} XP
              </Text>
              <XPBar xp={currentUser?.xp || 0} nextLevel={nextLevelXp} />
              <Text style={{ color: '#B0BEC5', fontSize: 12, marginTop: 4 }}>
                {nextLevelXp - (currentUser?.xp || 0)} XP to next level
              </Text>
            </View>

            {/* Stats - Force show */}
            <View style={{ 
              backgroundColor: '#1E1E1E', 
              padding: 20, 
              borderRadius: 16, 
              marginBottom: 20 
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                Today's Progress
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#4CAF50', fontSize: 24, fontWeight: 'bold' }}>
                    {completedTasks.length}
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 14 }}>Completed</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
                    {pendingTasks.length}
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 14 }}>Pending</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#2196F3', fontSize: 24, fontWeight: 'bold' }}>
                    {tasks?.length || 0}
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 14 }}>Total</Text>
                </View>
              </View>
            </View>

            {/* Recent Tasks - Force show */}
            <View style={{ 
              backgroundColor: '#1E1E1E', 
              padding: 20, 
              borderRadius: 16 
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                Recent Tasks
              </Text>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <View key={task.id} style={{ 
                    marginBottom: 12, 
                    padding: 12, 
                    backgroundColor: '#2A2A2A', 
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: task.completed ? '#4CAF50' : '#FFD54F'
                  }}>
                    <Text style={{ 
                      color: '#FFFFFF', 
                      fontSize: 16,
                      textDecorationLine: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1
                    }}>
                      {task.title}
                    </Text>
                    <Text style={{ color: '#FFD54F', fontSize: 12, marginTop: 4 }}>
                      +{task.xpWeight} XP
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#B0BEC5', fontSize: 16 }}>
                  No tasks yet. Create your first task in the Tasks tab!
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text style={{ color: '#FFFFFF', marginTop: 10 }}>
            Welcome to ProductivityLeveling!
          </Text>
        )}
      </ScrollView>
    </View>
  );
} 