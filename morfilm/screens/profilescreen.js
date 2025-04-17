import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from './supabaseClient';
import { textStyles } from '../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



export default function ProfileScreen() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNickname = async () => {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error fetching user:', error.message);
        setLoading(false);
        return;
      }

      // el nickname es guarda a user_metadata quan fas signUp
      const nicknameFromMeta = user?.user_metadata?.nickname;
      setNickname(nicknameFromMeta || 'User');
      setLoading(false);
    };

    fetchNickname();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#206a4e" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={textStyles.headlineSmall}>Welcome back {nickname}!</Text>

      {/* Aquí anirà la lògica de Favorits i Watchlist més endavant */}

      <TouchableOpacity style={styles.manageBtn}>
        <Icon name="format-list-bulleted" size={18} color="#171d1a" />
        <Text style={styles.manageBtnText}> Manage lists</Text>
      </TouchableOpacity>

      <Text style={[textStyles.titleLarge, { marginTop: 32 }]}>❤️ Favorites</Text>
      {/* Aquí carregaràs les pelis favorites des de Supabase */}

      <Text style={[textStyles.titleLarge, { marginTop: 32 }]}>🕓 Watchlist</Text>
      {/* Aquí carregaràs les pelis de la watchlist també */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fbf5',
    padding: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fbf5',
  },
  manageBtn: {
    backgroundColor: '#cfe9d9',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  manageBtnText: {
    fontSize: 14,
    color: '#171d1a',
    fontWeight: '500',
  },
});
