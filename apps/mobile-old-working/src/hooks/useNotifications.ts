import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export const useNotifications = () => {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const scheduleTaskReminder = async (id: string, title: string, date: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Task Reminder", body: title },
      trigger: date
    });
  };

  const cancelReminder = async (identifier: string) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  };

  return { scheduleTaskReminder, cancelReminder };
};
