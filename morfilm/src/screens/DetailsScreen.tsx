import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import MovieSection from '../components/MovieSection';
import { Movie } from '../lib/tmdb';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params || {};
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { colors } = useTheme();

  const userScore = movie?.vote_average ? Math.round(movie.vote_average * 10) : 0;
  const tagline = movie?.tagline || 'Love is a hustle.';
  const movieYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : '—';

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

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movie.id)
        .maybeSingle();
      if (data) setIsFavorite(true);
    };
    if (movie?.id) checkFavorite();
  }, [movie?.id]);

  const handleAddToFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id);
      setIsFavorite(false);
      Alert.alert('Removed from favorites');
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
      setIsFavorite(true);
      Alert.alert('Added to favorites');
    }
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
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Added to watchlist!');
    }
  };

  if (!movie) return <Text>Movie not found</Text>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w780${movie.poster_path}` }}
          style={styles.heroImage}
        >
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <View style={styles.circleButton}>
              <Icon name="chevron-down" size={28} color="#0B1B17" />
            </View>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.movieTitle}>
              {movie.title} <Text style={styles.movieYear}>{movieYear}</Text>
            </Text>
            <Text style={styles.tagline}>{tagline}</Text>

            <View style={styles.actionButtonRow}>
              <TouchableOpacity style={styles.iconButton} onPress={handleAddToFavorites}>
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorite ? '#ba1a1a' : '#206A4E'}
                />
                <Text style={styles.iconButtonText}>
                  {isFavorite ? 'In favorites' : 'Add to favorites'}
                </Text>
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
          </View>

          <MovieSection
            title="Related movies"
            icon="fire"
            movies={relatedMovies}
            onSelectMovie={(m) => navigation.push('Details', { movie: m })}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.45, justifyContent: 'flex-end' },
  closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  circleButton: { backgroundColor: '#D2EFE2', borderRadius: 999, padding: 3 },
  heroContent: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 16 },
  movieTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  movieYear: { fontSize: 18, fontWeight: '400', color: '#fff' },
  tagline: { fontSize: 16, fontStyle: 'italic', color: '#fff', marginBottom: 6 },
  actionButtonRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
  iconButton: { backgroundColor: '#f5fbf5', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  iconButtonText: { fontSize: 14, color: '#206A4E', marginLeft: 6, fontWeight: '600' },
  contentContainer: { padding: 16 },
  overview: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  userScoreContainer: { flexDirection: 'row', alignItems: 'center' },
  scoreTextWrapper: { marginLeft: 12 },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: '#206A4E' },
  scoreLabel: { fontSize: 12, color: '#333' },
});
