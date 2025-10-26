import { useState, useEffect } from 'react';
import { useFitness } from '@/contexts/FitnessContext';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Clock, Trash2, Shield, Moon, Smartphone, Download, Upload } from 'lucide-react';
import { NotificationSettings, UserPreferences } from '@/types/fitness';

export const Settings = () => {
  const { userPreferences, setUserPreferences } = useFitness();
  const { toast } = useToast();

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    userPreferences?.notificationSettings || {
      mealReminders: true,
      workoutReminders: true,
      progressUpdates: true,
      weeklyReports: false,
      mealReminderTimes: ['08:00', '12:00', '18:00'],
      workoutReminderTime: '07:00'
    }
  );

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast({ title: 'Notifications Enabled', description: 'You\'ll now receive fitness reminders.' });
        // Show a test notification
        new Notification('FitGenie AI', {
          body: 'Notifications are now enabled! Stay on track with your fitness goals.',
          icon: '/favicon.ico'
        });
      } else {
        toast({ title: 'Notifications Blocked', description: 'Enable notifications in your browser settings to receive reminders.', variant: 'destructive' });
      }
    }
  };

  const handleSaveNotifications = () => {
    const updatedPreferences: UserPreferences = {
      ...userPreferences,
      notificationSettings
    };
    setUserPreferences(updatedPreferences);
    
    if (permissionStatus === 'granted' && notificationSettings.mealReminders) {
      scheduleNotifications();
    }
    
    toast({ title: 'Settings Saved', description: 'Your notification preferences have been updated.' });
  };

  const scheduleNotifications = () => {
    // In a real app, you would use a service worker or backend service
    // This is a simple example using setTimeout
    const now = new Date();
    
    notificationSettings.mealReminderTimes.forEach((time, index) => {
      const [hours, minutes] = time.split(':').map(Number);
      const notificationTime = new Date();
      notificationTime.setHours(hours, minutes, 0, 0);
      
      if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
      
      const timeUntil = notificationTime.getTime() - now.getTime();
      
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          const mealTypes = ['breakfast', 'lunch', 'dinner'];
          new Notification('Meal Reminder', {
            body: `Time for ${mealTypes[index]}! Don't forget to log your meal.`,
            icon: '/favicon.ico'
          });
        }
      }, Math.min(timeUntil, 2147483647)); // Max timeout value
    });
  };

  const addMealReminderTime = () => {
    if (notificationSettings.mealReminderTimes.length < 6) {
      setNotificationSettings({
        ...notificationSettings,
        mealReminderTimes: [...notificationSettings.mealReminderTimes, '12:00']
      });
    }
  };

  const updateMealReminderTime = (index: number, time: string) => {
    const newTimes = [...notificationSettings.mealReminderTimes];
    newTimes[index] = time;
    setNotificationSettings({
      ...notificationSettings,
      mealReminderTimes: newTimes
    });
  };

  const removeMealReminderTime = (index: number) => {
    if (notificationSettings.mealReminderTimes.length > 1) {
      const newTimes = notificationSettings.mealReminderTimes.filter((_, i) => i !== index);
      setNotificationSettings({
        ...notificationSettings,
        mealReminderTimes: newTimes
      });
    }
  };

  const exportData = () => {
    // Export user data as JSON
    const dataToExport = {
      userPreferences,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitgenie-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({ title: 'Data Exported', description: 'Your fitness data has been downloaded.' });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast({ title: 'Data Cleared', description: 'All your data has been removed from this device.' });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header title="Settings" subtitle="Customize your experience" />

      <main className="px-4 py-6 space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure reminders and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissionStatus === 'default' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Enable Notifications</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Allow notifications to receive meal and workout reminders.
                </p>
                <Button onClick={requestNotificationPermission} size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </Button>
              </div>
            )}
            
            {permissionStatus === 'denied' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Notifications Blocked</h4>
                <p className="text-sm text-red-700">
                  Please enable notifications in your browser settings to receive reminders.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="meal-reminders" className="text-sm font-medium">Meal Reminders</Label>
                  <p className="text-xs text-muted-foreground">Get notified when it's time to eat</p>
                </div>
                <Switch
                  id="meal-reminders"
                  checked={notificationSettings.mealReminders}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    mealReminders: checked
                  })}
                />
              </div>

              {notificationSettings.mealReminders && (
                <div className="ml-4 space-y-3">
                  <Label className="text-sm">Meal Times</Label>
                  {notificationSettings.mealReminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => updateMealReminderTime(index, e.target.value)}
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMealReminderTime(index)}
                        disabled={notificationSettings.mealReminderTimes.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addMealReminderTime}
                    disabled={notificationSettings.mealReminderTimes.length >= 6}
                  >
                    Add Meal Time
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="workout-reminders" className="text-sm font-medium">Workout Reminders</Label>
                  <p className="text-xs text-muted-foreground">Daily workout notifications</p>
                </div>
                <Switch
                  id="workout-reminders"
                  checked={notificationSettings.workoutReminders}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    workoutReminders: checked
                  })}
                />
              </div>

              {notificationSettings.workoutReminders && (
                <div className="ml-4">
                  <Label className="text-sm">Workout Time</Label>
                  <Input
                    type="time"
                    value={notificationSettings.workoutReminderTime || '07:00'}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      workoutReminderTime: e.target.value
                    })}
                    className="w-32 mt-1"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="progress-updates" className="text-sm font-medium">Progress Updates</Label>
                  <p className="text-xs text-muted-foreground">Daily progress summaries</p>
                </div>
                <Switch
                  id="progress-updates"
                  checked={notificationSettings.progressUpdates}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    progressUpdates: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports" className="text-sm font-medium">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Weekly fitness summaries</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    weeklyReports: checked
                  })}
                />
              </div>
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or clear your fitness data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportData} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button onClick={clearAllData} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Your data is stored locally on your device. Exporting creates a backup you can save elsewhere.
            </p>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About FitGenie AI</CardTitle>
            <CardDescription>Version 1.0.0</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your AI-powered fitness companion for personalized meal plans, workouts, and progress tracking.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Storage Used:</span>
                <span>{Math.round(JSON.stringify(localStorage).length / 1024)}KB</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};
