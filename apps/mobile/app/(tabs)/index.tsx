import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/api/xp';
import { useTasks } from '../../src/api/tasks';
import { useNutritionGoals } from '../../src/api/nutrition';
import { calcLevel } from '../../src/lib/xp';
import XPBar from '../../src/components/XPBar';
import MMORPGIcon, { ICON_NAMES } from '../../src/components/MMORPGIcons';
import ProfileGoals from '../../src/components/ProfileGoals';

export default function Dashboard() {
  const { user: authUser, token } = useAuth();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: nutritionGoals } = useNutritionGoals();
  const [showProfileGoals, setShowProfileGoals] = useState(false);

  const recentTasks = tasks?.slice(0, 3) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];
  const pendingTasks = tasks?.filter(task => !task.completed) || [];
  
  // Use API user data if available, otherwise fall back to auth user
  const currentUser = user || authUser;
  const { level, nextLevelXp } = currentUser ? calcLevel(currentUser.xp || 0) : { level: 0, nextLevelXp: 100 };



  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MMORPGIcon name={ICON_NAMES.HOME} size={28} color="#FFD54F" style={{ marginRight: 12 }} />
            <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
              Dashboard
            </Text>
          </View>
          
          {token && (
            <TouchableOpacity 
              onPress={() => setShowProfileGoals(true)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#1E1E1E',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2A2A2A'
              }}
            >
              <MMORPGIcon name={ICON_NAMES.NUTRITION} size={16} color="#FFD54F" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FFD54F', fontSize: 14, fontWeight: '500' }}>
                Goals
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {token ? (
          <>
            {/* User Info */}
            <View style={{ 
              backgroundColor: '#1E1E1E', 
              padding: 20, 
              borderRadius: 16, 
              marginBottom: 20 
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MMORPGIcon name={ICON_NAMES.CROWN} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                  Welcome back, {currentUser?.name || 'User'}!
                </Text>
              </View>
              

              <Text style={{ color: '#FFD54F', fontSize: 16, marginTop: 8 }}>
                Level {level + 1} • {currentUser?.xp || 0} XP
              </Text>
              <XPBar xp={currentUser?.xp || 0} nextLevel={nextLevelXp} />
              <Text style={{ color: '#B0BEC5', fontSize: 12, marginTop: 4 }}>
                {nextLevelXp - (currentUser?.xp || 0)} XP to next level
              </Text>
            </View>

            {/* Stats */}
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

            {/* Nutrition Goals Summary */}
            <View style={{ 
              backgroundColor: '#1E1E1E', 
              padding: 20, 
              borderRadius: 16, 
              marginBottom: 20 
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MMORPGIcon name={ICON_NAMES.NUTRITION} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                    Nutrition Goals
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowProfileGoals(true)}>
                  <MMORPGIcon name={ICON_NAMES.EDIT} size={16} color="#FFD54F" />
                </TouchableOpacity>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#FF6B35', fontSize: 20, fontWeight: 'bold' }}>
                    {nutritionGoals?.targetKcal || 2000}
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Calories</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#4CAF50', fontSize: 20, fontWeight: 'bold' }}>
                    {nutritionGoals?.targetProtein || 150}g
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Protein</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
                    {nutritionGoals?.targetCarbs || 250}g
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Carbs</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#FF6B35', fontSize: 20, fontWeight: 'bold' }}>
                    {nutritionGoals?.targetFat || 65}g
                  </Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Fat</Text>
                </View>
              </View>
              
              <Text style={{ color: '#8BC34A', fontSize: 14, textAlign: 'center' }}>
                Fiber: {nutritionGoals?.targetFiber || 25}g
              </Text>
            </View>

            {/* Recent Tasks */}
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
      
      {/* Profile Goals Modal */}
      <ProfileGoals 
        visible={showProfileGoals} 
        onClose={() => setShowProfileGoals(false)} 
      />
    </View>
  );
} 