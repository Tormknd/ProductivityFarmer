import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MMORPGIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// MMORPG-style icon mappings using Unicode symbols and custom styling
const MMORPG_ICONS: { [key: string]: { symbol: string; style?: any } } = {
  // XP and Level Icons
  'xp': { symbol: '⚔️', style: { fontSize: 0.8 } },
  'level': { symbol: '⭐', style: { fontSize: 0.9 } },
  'experience': { symbol: '✨', style: { fontSize: 0.85 } },
  'skill': { symbol: '🔮', style: { fontSize: 0.8 } },
  
  // Task and Quest Icons
  'task': { symbol: '📜', style: { fontSize: 0.8 } },
  'quest': { symbol: '🗡️', style: { fontSize: 0.8 } },
  'mission': { symbol: '🏹', style: { fontSize: 0.8 } },
  'challenge': { symbol: '⚡', style: { fontSize: 0.8 } },
  'achievement': { symbol: '🏆', style: { fontSize: 0.8 } },
  
  // Time and Date Icons
  'today': { symbol: '⚔️', style: { fontSize: 0.8 } },
  'tomorrow': { symbol: '🛡️', style: { fontSize: 0.8 } },
  'this-week': { symbol: '🗡️', style: { fontSize: 0.8 } },
  'next-week': { symbol: '🏹', style: { fontSize: 0.8 } },
  'calendar': { symbol: '📜', style: { fontSize: 0.8 } },
  'time': { symbol: '⏰', style: { fontSize: 0.8 } },
  'deadline': { symbol: '⏳', style: { fontSize: 0.8 } },
  
  // Difficulty and Importance Icons
  'easy': { symbol: '🟢', style: { fontSize: 0.7 } },
  'medium': { symbol: '🟡', style: { fontSize: 0.7 } },
  'hard': { symbol: '🔴', style: { fontSize: 0.7 } },
  'epic': { symbol: '💜', style: { fontSize: 0.7 } },
  'legendary': { symbol: '🟠', style: { fontSize: 0.7 } },
  
  // Navigation Icons
  'home': { symbol: '🏰', style: { fontSize: 0.8 } },
  'tasks': { symbol: '⚔️', style: { fontSize: 0.8 } },
  'nutrition': { symbol: '🍖', style: { fontSize: 0.8 } },
  'chat': { symbol: '📢', style: { fontSize: 0.8 } },
  'settings': { symbol: '⚙️', style: { fontSize: 0.8 } },
  
  // Status Icons
  'completed': { symbol: '✅', style: { fontSize: 0.8 } },
  'pending': { symbol: '⏳', style: { fontSize: 0.8 } },
  'failed': { symbol: '❌', style: { fontSize: 0.8 } },
  'in-progress': { symbol: '🔄', style: { fontSize: 0.8 } },
  
  // Fantasy Elements
  'sword': { symbol: '🗡️', style: { fontSize: 0.8 } },
  'shield': { symbol: '🛡️', style: { fontSize: 0.8 } },
  'magic': { symbol: '🔮', style: { fontSize: 0.8 } },
  'potion': { symbol: '🧪', style: { fontSize: 0.8 } },
  'scroll': { symbol: '📜', style: { fontSize: 0.8 } },
  'crown': { symbol: '👑', style: { fontSize: 0.8 } },
  'gem': { symbol: '💎', style: { fontSize: 0.8 } },
  'coin': { symbol: '🪙', style: { fontSize: 0.8 } },
  
  // Action Icons
  'attack': { symbol: '⚔️', style: { fontSize: 0.8 } },
  'defend': { symbol: '🛡️', style: { fontSize: 0.8 } },
  'heal': { symbol: '💚', style: { fontSize: 0.8 } },
  'buff': { symbol: '✨', style: { fontSize: 0.8 } },
  'debuff': { symbol: '💀', style: { fontSize: 0.8 } },
  
  // UI Elements
  'close': { symbol: '✕', style: { fontSize: 0.9, fontWeight: 'bold' } },
  'confirm': { symbol: '✓', style: { fontSize: 0.9, fontWeight: 'bold' } },
  'cancel': { symbol: '✗', style: { fontSize: 0.9, fontWeight: 'bold' } },
  'edit': { symbol: '✏️', style: { fontSize: 0.8 } },
  'delete': { symbol: '🗑️', style: { fontSize: 0.8 } },
  'add': { symbol: '➕', style: { fontSize: 0.8 } },
  'remove': { symbol: '➖', style: { fontSize: 0.8 } },
  
  // Default fallback
  'default': { symbol: '⚔️', style: { fontSize: 0.8 } },
};

export default function MMORPGIcon({ name, size = 24, color = '#FFD54F', style }: MMORPGIconProps) {
  const iconData = MMORPG_ICONS[name] || MMORPG_ICONS['default'];
  const iconSize = size * (iconData.style?.fontSize || 1);
  
  return (
    <View style={[styles.container, style]}>
      <Text 
        style={[
          styles.icon,
          {
            fontSize: iconSize,
            color: color,
            fontWeight: iconData.style?.fontWeight || 'normal',
          }
        ]}
      >
        {iconData.symbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

// Export commonly used icon names for easy access
export const ICON_NAMES = {
  XP: 'xp',
  LEVEL: 'level',
  EXPERIENCE: 'experience',
  SKILL: 'skill',
  TASK: 'task',
  QUEST: 'quest',
  MISSION: 'mission',
  CHALLENGE: 'challenge',
  ACHIEVEMENT: 'achievement',
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'this-week',
  NEXT_WEEK: 'next-week',
  CALENDAR: 'calendar',
  TIME: 'time',
  DEADLINE: 'deadline',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  HOME: 'home',
  TASKS: 'tasks',
  NUTRITION: 'nutrition',
  CHAT: 'chat',
  SETTINGS: 'settings',
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  IN_PROGRESS: 'in-progress',
  SWORD: 'sword',
  SHIELD: 'shield',
  MAGIC: 'magic',
  POTION: 'potion',
  SCROLL: 'scroll',
  CROWN: 'crown',
  GEM: 'gem',
  COIN: 'coin',
  ATTACK: 'attack',
  DEFEND: 'defend',
  HEAL: 'heal',
  BUFF: 'buff',
  DEBUFF: 'debuff',
  CLOSE: 'close',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  EDIT: 'edit',
  DELETE: 'delete',
  ADD: 'add',
  REMOVE: 'remove',
} as const; 