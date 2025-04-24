import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Movie } from '../lib/tmdb'; // Asegúrate de tener la interfaz `Movie` disponible

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Obtener los datos del usuario desde Supabase
      const user = supabase.auth.user();
      setUser(user);

      if (user) {
        // Obtener los favoritos y watchlist del usuario desde la base de datos de Supabase
        try {
          const { data: favs } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id);

          const { data: watch } = await supabase
            .from('watchlist')
            .select('*')
            .eq('user_id', user.id);

          setFavorites(favs || []);
          setWatchlist(watch || []);
        } catch (error) {
          console.error('Error fetching data from Supabase:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Renderizado de la interfaz de usuario
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <View>
          <Text style={styles.userInfo}>Name: {user.email}</Text>
          <Text style={styles.userInfo}>ID: {user.id}</Text>

          {/* Renderizar favoritos */}
          <Text style={styles.sectionTitle}>Favorites</Text>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Text>{item.title}</Text>
                {/* Aquí podrías agregar una imagen de la película, etc. */}
              </View>
            )}
          />

          {/* Renderizar watchlist */}
          <Text style={styles.sectionTitle}>Watchlist</Text>
          <FlatList
            data={watchlist}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Text>{item.title}</Text>
                {/* Aquí podrías agregar una imagen de la película, etc. */}
              </View>
            )}
          />

          {/* Botón de logout */}
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <Text>User not found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  movieCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
});
