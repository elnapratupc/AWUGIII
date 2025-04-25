import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Movie } from '../lib/tmdb'; // Asegúrate de tener la interfaz `Movie` disponible
import FooterNav from '../components/FooterNav'; // Importa FooterNav si lo necesitas
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Asegúrate de importar Icon
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

export default function ProfileScreen() {
  const navigation = useNavigation(); // Hacemos que `navigation` esté disponible
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const nicknameFromMeta = user?.user_metadata?.nickname;
        setNickname(nicknameFromMeta || 'User');

        // Obtener los favoritos desde Supabase
        try {
          const { data: favs, error: favError } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id);

          const { data: watch, error: watchError } = await supabase
            .from('watchlist')
            .select('*')
            .eq('user_id', user.id);

          setFavorites(favs || []);
          setWatchlist(watch || []);

          if (favError) console.error('Error fetching favorites:', favError);
          if (watchError) console.error('Error fetching watchlist:', watchError);
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

  const handleMoviePress = (movie: Movie) => {
    // Al hacer clic en una película, navegamos a la pantalla de detalles
    navigation.push('Details', { movie: movie }); // Pasa el objeto de la película completo
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#206a4e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => console.log('Settings pressed')}>
            <Icon name="cog-outline" size={24} color="#171d1a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Welcome back {nickname}!</Text>

        <TouchableOpacity style={styles.manageBtn}>
          <Icon name="format-list-bulleted" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}>Manage lists</Text>
        </TouchableOpacity>

        {/* Mostrar favoritos */}
        {favorites.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Favorites</Text>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleMoviePress(item)} // Llama a `handleMoviePress` pasando el objeto completo
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.poster}
                  />
                  <Text style={styles.labelLarge} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.bodySmall}>
                    {new Date(item.release_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Mostrar watchlist */}
        {watchlist.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Watchlist</Text>
            <FlatList
              data={watchlist}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleMoviePress(item)} // Llama a `handleMoviePress` pasando el objeto completo
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.poster}
                  />
                  <Text style={styles.labelLarge} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.bodySmall}>
                    {new Date(item.release_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Botón de logout */}
        <TouchableOpacity style={styles.manageBtn} onPress={handleLogout}>
          <Icon name="logout" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <FooterNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  innerContainer: {
    backgroundColor: '#f5fbf5',
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 16,
    marginBottom: 16,
  },
  manageBtnText: {
    fontSize: 14,
    color: '#171d1a',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  trendingIcon: {
    marginRight: 10,
  },
  trailersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  trailersIcon: {
    marginRight: 10,
  },
  carousel: {
    paddingRight: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    width: 120,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  labelLarge: {
    fontSize: 18,
    fontWeight: '400',
    color: '#171d1a',
  },
  bodySmall: {
    fontSize: 14,
    color: '#404943',
  },
});
