import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import MenuList from '../components/MenuList';
import MenuListItem from '../components/MenuListItem';
import NotificationPreview from '../components/NotificationPreview';
import useColors from '../hooks/useColors';
import useNotification from '../hooks/useNotifications';
import { SettingsState, useSettings } from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

export default function ReminderScreen() {
  const { setSettings, settings } = useSettings()
  const { 
    askForPermission, 
    hasPermission, 
    schedule, 
    cancelAll,
  } = useNotification()

  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const colors = useColors()
  const i18n = useTranslation()
  
  const hourAndMinute = reminderTime.split(':')
  const hour = parseInt(hourAndMinute[0])
  const minute = parseInt(hourAndMinute[1])
  const timeDate = dayjs().hour(hour).minute(minute).toDate()
  
  const onEnabledChange = async (value: boolean) => {
    const has = await hasPermission()
    if(!has) {
      await askForPermission()
    }
    if(!value) {
      await cancelAll()
    }
    setReminderEnabled(value && has)
  }
  
  useEffect(() => {
    (async () => {
      await cancelAll()
      await schedule({
        content: {
          title: i18n.t('notification_reminder_title'),
          body: i18n.t('notification_reminder_body'),
        },
        trigger: {
          repeats: true,
          hour: hour,
          minute: minute,
        },
      })
    })()
    
    setSettings((settings: SettingsState) => ({
      ...settings, 
      reminderEnabled,
      reminderTime,
    }))
  }, [reminderEnabled, reminderTime])
  
  const onTimeChange = async (event: any, selectedDate: any) => {
    setReminderTime(dayjs(selectedDate).format('HH:mm'))
  }
  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
      }}
    >
      <ScrollView style={{ 
        padding: 20,
      }}>
        <View style={{
          opacity: reminderEnabled ? 1 : 0.5,
          marginBottom: 20,
        }}>
          <NotificationPreview />
        </View>
        <MenuList>
          <MenuListItem
            title={i18n.t('reminder')}
            iconRight={
              <Switch
                ios_backgroundColor={colors.backgroundSecondary}
                onValueChange={() => onEnabledChange(!reminderEnabled)}
                value={reminderEnabled}
                testID='reminder-enabled'
              />
            }
            isLast={!reminderEnabled}
          ></MenuListItem>
          { reminderEnabled &&
            <MenuListItem
              title={i18n.t('time')}
              iconRight={
                <DateTimePicker
                  testID="reminder-time"
                  style={{ width: '100%', height: 35 }} 
                  mode="time" 
                  display="clock" 
                  value={timeDate}
                  onChange={onTimeChange}
                />}
              isLast
            ></MenuListItem>
          }
        </MenuList>
      </ScrollView>
    </View>
  );
}
