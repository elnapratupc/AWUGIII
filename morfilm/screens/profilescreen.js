import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from './supabaseClient';
import { textStyles } from '../theme/typography';
import FooterNav from '../components/footerNav';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const fetchProfileData = async () => {
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.log('Error fetching user:', error.message);
      setLoading(false);
      return;
    }

    const nicknameFromMeta = user?.user_metadata?.nickname;
    setNickname(nicknameFromMeta || 'User');

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
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const handleMoviePress = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US`
      );
      const fullMovie = await res.json();
      navigation.push('Details', { movie: fullMovie });
    } catch (err) {
      console.error('Error fetching full movie:', err);
    }
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleMoviePress(item.movie_id)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={textStyles.labelLarge} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[textStyles.bodySmall, { color: '#404943' }]}>
        {new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </TouchableOpacity>
  );

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

        <Text style={textStyles.headlineSmall}>Welcome back {nickname}!</Text>

        <TouchableOpacity style={styles.manageBtn}>
          <Icon name="format-list-bulleted" size={18} color="#171d1a" />
          <Text style={styles.manageBtnText}> Manage lists</Text>
        </TouchableOpacity>

        <View style={styles.trendingRow}>
          <Icon name="heart" size={22} color="#171d1a" style={styles.trendingIcon} />
          <Text style={textStyles.titleLarge}>Favorites</Text>
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.movie_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={renderMovieCard}
        />

        <View style={styles.trailersRow}>
          <Icon name="playlist-plus" size={22} color="#171d1a" style={styles.trailersIcon} />
          <Text style={textStyles.titleLarge}>Watchlist</Text>
        </View>

        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.movie_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={renderMovieCard}
        />
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
});
