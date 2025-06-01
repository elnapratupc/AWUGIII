import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import FooterNav from '../components/FooterNav';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ManageListsModal from '../components/ManageListsModal';


// Tipus de dades per a una llista personal
interface MovieList {
  id: string;
  name: string;
  movies: any[];
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [customLists, setCustomLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [showManageLists, setShowManageLists] = useState(false);

  // Carrega totes les dades de l'usuari (favorits, watchlist, llistes i pel·lícules de cada llista)
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      setNickname(user.user_metadata?.nickname || 'User');

      // FAVORITES
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

      // WATCHLIST (opcional)
      const { data: watch } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);

      setWatchlist(watch || []);

      // CUSTOM LISTS i pel·lícules associades
      const { data: lists } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', user.id);

      if (lists && lists.length > 0) {
        const listIds = lists.map((l) => l.id);
        const { data: movieListRows } = await supabase
          .from('movie_lists')
          .select('*')
          .in('list_id', listIds);

        const listsWithMovies: MovieList[] = lists.map((list) => ({
          id: list.id,
          name: list.name,
          movies: (movieListRows || []).filter((ml) => ml.list_id === list.id),
        }));

        setCustomLists(listsWithMovies);
      } else {
        setCustomLists([]);
      }
    }
    setLoading(false);
  }, []);

  // Refresca dades en obrir perfil o després de gestionar llistes
 useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    await fetchUserData();
    setLoading(false);
  };

  loadData();
}, [isFocused, fetchUserData]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleMoviePress = async (item: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=2903fc4c6bd618022e8965d44f45e020&language=ca`
    );
    const fullMovie = await res.json();

    navigation.push('Details', { movie: fullMovie });
  } catch (error) {
    console.error('❌ Error carregant pel·lícula completa:', error);
    Alert.alert('Error', 'No s’ha pogut carregar la informació de la pel·lícula');
  }
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
<ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity  onPress={() => navigation.navigate('SettingsScreen')}>
  <Icon name="cog-outline" size={24} color="#171d1a" />
</TouchableOpacity>
        </View>

        {/* WELCOME + MANAGE */}
        <Text style={styles.title}>Welcome back {nickname}!</Text>

        <TouchableOpacity style={styles.manageBtn} onPress={() => setShowManageLists(true)}>
          <Icon name="format-list-bulleted" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}>Manage lists</Text>
        </TouchableOpacity>

        {/* FAVORITES */}
<Text style={styles.sectionTitle}>Favorites</Text>
{favorites.length === 0 ? (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>You haven't added any favorites yet.</Text>
<Icon name="emoticon-sad-outline" size={40} color="#888" style={styles.noResultsIcon} />
  </View>
) : (
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
          <Icon name="heart" size={18} color="#ba1a1a" />
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
)}

        {/* WATCHLIST */}
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

       {/* CUSTOM LISTS */}
<Text style={styles.sectionTitle}>Your Lists</Text>
{customLists.length === 0 ? (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>You haven’t created any custom lists yet.</Text>
<Icon name="emoticon-sad-outline" size={40} color="#888" style={styles.noResultsIcon} />
  </View>
) : (
  customLists.map((list) => (
    <View key={list.id} style={{ marginBottom: 28 }}>
      <View style={styles.customListRow}>
        <Icon name="folder-outline" size={20} color="#206a4e" style={{ marginRight: 6 }} />
        <Text style={styles.customListText}>{list.name}</Text>
      </View>
      {list.movies.length === 0 ? (
        <Text style={styles.emptyMessage}>No movies in this list.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {list.movies.map((item) => (
            <TouchableOpacity
              key={item.movie_id}
              style={styles.card}
              onPress={() => handleMoviePress(item)}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.poster}
              />
              <Text style={styles.labelLarge} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.bodySmall}>
                {item.release_date && new Date(item.release_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  ))
)}


        {/* LOGOUT */}
        <TouchableOpacity style={styles.manageBtn} onPress={handleLogout}>
          <Icon name="logout" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterNav />

      {/* Modal per gestionar llistes */}
      {user && (
        <ManageListsModal
          visible={showManageLists}
          onClose={() => setShowManageLists(false)}
          userId={user.id}
          onAnyListChange={fetchUserData}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#eaeaea',
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
    marginLeft: 8,
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
  customListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  customListText: {
    fontSize: 16,
    color: '#206a4e',
    fontWeight: '500',
  },
  noResultsContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
},
noResultsText: {
  fontSize: 16,
  color: '#888',
  marginBottom: 6,
},
noResultsIcon: {
  fontSize: 26,
  color: '#888',
},
scrollContent: {
  flexGrow: 1,
  justifyContent: 'space-between',
  backgroundColor: '#f5fbf5',
  paddingHorizontal: 24,
  paddingTop: 25,
  paddingBottom: 48,
},


});
