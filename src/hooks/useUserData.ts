import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // 1. Avval mahalliy xotiradan ID ni olamiz
      const profileData = await AsyncStorage.getItem('user_profile');
      if (!profileData) return;
      
      const localProfile = JSON.parse(profileData);

      // 2. Supabase'dan eng yangi ma'lumotlarni olamiz
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('child_name', localProfile.child_name) // Ism bo'yicha qidirish
        .single();

      if (data) setUser(data);
    } catch (e) {
      console.log("Xatolik:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refresh: fetchUser };
};
