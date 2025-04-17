import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from './supabaseClient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params || {};

  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US&page=1`
        );
        const data = await res.json();
        setRelatedMovies(data.results || []);
      } catch (error) {
        console.log('Error fetching related movies:', error);
      }
    };
    if (movie?.id) fetchRelatedMovies();
  }, [movie?.id]);

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text>No movie data available.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#206A4E', marginTop: 20 }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userScore = movie.vote_average ? Math.round(movie.vote_average * 10) : 0;
  const tagline = movie.tagline || 'Love is a hustle.';
  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';

  const handleAddToFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Added to favorites!');
  };

  const handleAddToWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Added to watchlist!');
  };

  const renderRelatedMovie = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.push('Details', { movie: item })}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#171d1a' }} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 12, color: '#404943' }}>
        {new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w780${movie.poster_path}` }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <View style={styles.circleButton}>
              <Icon name="chevron-down" size={28} color="#0B1B17" />
            </View>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.movieTitle}>{movie.title} <Text style={styles.movieYear}>{movieYear}</Text></Text>
            <Text style={styles.tagline}>{tagline}</Text>

            <View style={styles.actionButtonRow}>
              <TouchableOpacity style={styles.iconButton} onPress={handleAddToFavorites}>
                <Icon name="heart-outline" size={18} color="#206A4E" />
                <Text style={styles.iconButtonText}>Add to favorites</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleAddToWatchlist}>
                <Icon name="playlist-plus" size={18} color="#206A4E" />
                <Text style={styles.iconButtonText}>Add to list…</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <Text style={styles.overview}>{movie.overview}</Text>

          <View style={styles.statsRow}>
          <View style={styles.userScoreContainer}>
  <Svg width={48} height={48}>
    {/* Cercle de fons */}
    <Circle
      cx="24"
      cy="24"
      r="20"
      stroke="#CFE9D9"
      strokeWidth="4"
      fill="none"
      strokeDasharray={2 * Math.PI * 20}
      strokeDashoffset="0"
    />
    {/* Cercle de progrés */}
    <Circle
      cx="24"
      cy="24"
      r="20"
      stroke="#206A4E"
      strokeWidth="4"
      fill="none"
      strokeDasharray={2 * Math.PI * 20}
      strokeDashoffset={2 * Math.PI * 20 * (1 - userScore / 100)}
      strokeLinecap="round"
    />
  </Svg>

  <View style={styles.scoreTextWrapper}>
    <Text style={styles.scoreValue}>{userScore}%</Text>
    <Text style={styles.scoreLabel}>User Score</Text>
  </View>
</View>


            <View style={styles.watchContainer}>
              <Text style={styles.whereLabel}>Where to watch</Text>
              <Icon name="apple" size={22} color="#000" style={{ marginHorizontal: 6 }} />
              <Text style={styles.tvText}>TV</Text>
            </View>
          </View>

          <View style={styles.relatedRow}>
            <Icon name="fire" size={22} color="#171d1a" style={styles.trendingIcon} />
            <Text style={styles.sectionTitle}>Related movies</Text>
          </View>

          {relatedMovies.length > 0 ? (
            <FlatList
              data={relatedMovies}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={renderRelatedMovie}
            />
          ) : (
            <Text style={styles.noRelated}>No related movies found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5fbf5' },
  heroImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.45, justifyContent: 'flex-end' },
  closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  circleButton: { backgroundColor: '#D2EFE2', borderRadius: 999, padding: 3, alignItems: 'center', justifyContent: 'center' },
  heroContent: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 16 },
  movieTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  movieYear: { fontSize: 18, fontWeight: '400', color: '#fff' },
  tagline: { fontSize: 16, fontStyle: 'italic', color: '#fff' },
  actionButtonRow: { flexDirection: 'row', marginTop: 12, gap: 12, flexWrap: 'wrap' },
  iconButton: { backgroundColor: '#f5fbf5', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  iconButtonText: { fontSize: 14, color: '#206A4E', marginLeft: 6, fontWeight: '600' },
  contentContainer: { padding: 16 },
  overview: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 },
  userScoreContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  scoreTextWrapper: { marginLeft: 12, justifyContent: 'center', alignItems: 'flex-start' },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: '#206A4E', marginBottom: 2 },
  scoreLabel: { fontSize: 12, color: '#333' },
  watchContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  whereLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  tvText: { fontSize: 14, color: '#333' },
  relatedRow: { flexDirection: 'row', alignItems: 'center' },
  trendingIcon: { marginRight: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' },
  card: { width: 120, backgroundColor: '#e4eae4', borderRadius: 16, padding: 8, marginRight: 12, alignItems: 'flex-start' },
  poster: { width: '100%', aspectRatio: 2 / 3, borderRadius: 12, marginBottom: 8 },
  carousel: { paddingRight: 8, marginTop: 16 },
  noRelated: { fontSize: 14, color: '#666' },
});