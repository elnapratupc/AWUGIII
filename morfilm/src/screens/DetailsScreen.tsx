import React, { useEffect, useState } from 'react';
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
import { useTheme } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';
import MovieSection from '../components/MovieSection';
import MovieCard from '../components/MovieCard';
import AddToListModal from '../components/AddToListModal';
import { Movie } from '../lib/tmdb';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params || {};
  const { colors } = useTheme();

  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userFavorites, setUserFavorites] = useState<Movie[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [showListModal, setShowListModal] = useState(false);

  const userScore = movie?.vote_average ? Math.round(movie.vote_average * 10) : 0;
  const tagline = movie?.tagline || 'Love is a hustle.';
  const movieYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : '—';

  const refreshFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: allFavs, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error("❌ Error carregant favorits:", error.message);
      return;
    }

    setUserFavorites(allFavs || []);
    const found = allFavs?.some((f) => f.movie_id === movie.id);
    setIsFavorite(found || false);
  };

  useEffect(() => {
    if (movie?.id) refreshFavorites();
  }, [movie?.id]);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US&page=1`
      );
      const data = await res.json();
      setRelatedMovies(data.results || []);
    };
    if (movie?.id) fetchRelatedMovies();
  }, [movie?.id]);

  useEffect(() => {
    const fetchWatchProviders = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=2903fc4c6bd618022e8965d44f45e020`
      );
      const data = await res.json();
      const results = data.results?.ES || data.results?.US;

      if (results?.flatrate) {
        setProviders(results.flatrate);
      }
    };

    if (movie?.id) fetchWatchProviders();
  }, [movie?.id]);

  const toggleFavorite = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ NO USER:', userError);
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id);

      if (error) {
        console.log('❌ DELETE ERROR:', error.message);
        Alert.alert('Error', error.message);
      } else {
        await refreshFavorites();
        Alert.alert('Removed from favorites');
      }
    } else {
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });

      if (error) {
        console.log('❌ INSERT ERROR:', error.message);
        Alert.alert('Error', error.message);
      } else {
        await refreshFavorites();
        Alert.alert('Added to favorites');
      }
    }
  };

  const handleRemoveFromFavorites = async (favMovieId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', favMovieId);

    setUserFavorites(prev => prev.filter(m => m.movie_id !== favMovieId));
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
              <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorite ? '#ba1a1a' : '#206A4E'}
                />
                <Text style={styles.iconButtonText}>
                  {isFavorite ? 'In favorites' : 'Add to favorites'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowListModal(true)}
              >
                <Icon name="plus-box" size={18} color="#206A4E" />
                <Text style={styles.iconButtonText}>Add to list</Text>
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

            {providers.length > 0 && (
              <View style={styles.providersContainer}>
                <View style={styles.whereToWatchRow}>
                  <Icon name="television" size={14} color="#206A4E" style={{ marginRight: 4 }} />
                  <Text style={styles.whereToWatch}>Where to watch</Text>
                </View>
                <View style={styles.providerLogos}>
                  {providers.map((p) => (
                    <Image
                      key={p.provider_id}
                      source={{ uri: `https://image.tmdb.org/t/p/w45${p.logo_path}` }}
                      style={styles.providerLogo}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          <MovieSection
            title="Related movies"
            icon="fire"
            movies={relatedMovies}
            onSelectMovie={(m) => navigation.push('Details', { movie: m })}
          />

          {userFavorites.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Your Favorites</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
              >
                {userFavorites.map((fav) => (
                  <View key={fav.id} style={{ marginRight: 12, position: 'relative' }}>
                    <MovieCard
                      movie={fav}
                      onPress={() => navigation.push('Details', { movie: fav })}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveFromFavorites(fav.movie_id)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'white',
                        borderRadius: 999,
                        padding: 4,
                      }}
                    >
                      <Icon name="heart-off" size={18} color="#ba1a1a" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        <AddToListModal
          visible={showListModal}
          onClose={() => setShowListModal(false)}
          movie={movie}
        />
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
  iconButton: {
    backgroundColor: '#f5fbf5',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 14,
    color: '#206A4E',
    marginLeft: 6,
    fontWeight: '600',
  },
  contentContainer: { padding: 16 },
  overview: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 16 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userScoreContainer: { flexDirection: 'row', alignItems: 'center' },
  scoreTextWrapper: { marginLeft: 12 },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: '#206A4E' },
  scoreLabel: { fontSize: 12, color: '#333' },
  providersContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  whereToWatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whereToWatch: {
    fontSize: 14,
    fontWeight: '600',
    color: '#206A4E',
  },
  providerLogos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  providerLogo: {
    width: 30,
    height: 30,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
