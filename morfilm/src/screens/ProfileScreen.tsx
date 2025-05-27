import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Movie } from '../lib/tmdb';
import FooterNav from '../components/FooterNav';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        setNickname(user.user_metadata?.nickname || 'User');

        const { data: favs } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        const uniqueFavs = favs
          ? favs.filter((fav, index, self) =>
              index === self.findIndex((f) => f.movie_id === fav.movie_id)
            )
          : [];

        setFavorites(uniqueFavs);

        const { data: watch } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id);

        setWatchlist(watch || []);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.push('Details', { movie });
  };

  const handleRemoveFavorite = async (movie_id: number) => {
    if (!user) return;
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movie_id);

    setFavorites((prev) => prev.filter((m) => m.movie_id !== movie_id));
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
          <TouchableOpacity>
            <Icon name="cog-outline" size={24} color="#171d1a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Welcome back {nickname}!</Text>

        <TouchableOpacity style={styles.manageBtn}>
          <Icon name="format-list-bulleted" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}>Manage lists</Text>
        </TouchableOpacity>

        {/* Favorites */}
        {favorites.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Favorites</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {favorites.map((item) => (
                <View key={item.id} style={{ marginRight: 12, position: 'relative' }}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleMoviePress(item)}
                  >
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                      style={styles.poster}
                    />
                    <Text style={styles.labelLarge} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.bodySmall}>
                      {new Date(item.release_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(item.movie_id)}
                    style={styles.removeIcon}
                  >
                    <Icon name="heart-off" size={18} color="#ba1a1a" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Watchlist</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {watchlist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => handleMoviePress(item)}
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.poster}
                  />
                  <Text style={styles.labelLarge} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.bodySmall}>
                    {new Date(item.release_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Logout */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
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
  carousel: {
    paddingRight: 8,
    marginBottom: 8,
  },
  card: {
    width: 120,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
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
  removeIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 4,
    elevation: 2,
  },
});
