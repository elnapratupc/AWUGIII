import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params || {};

  const [relatedMovies, setRelatedMovies] = useState([]);

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text>No hay datos de la película.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#206A4E', marginTop: 20 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=TU_API_KEY&language=en-US&page=1`
        );
        const data = await res.json();
        setRelatedMovies(data.results || []);
      } catch (error) {
        console.log('Error fetching related movies:', error);
      }
    };

    fetchRelatedMovies();
  }, [movie.id]);

  const userScore = movie.vote_average ? Math.round(movie.vote_average * 10) : 0;
  const tagline = movie.tagline || 'Love is a hustle.';
  const movieYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '—';

  const renderRelatedMovie = ({ item }) => (
    <View style={styles.relatedCard}>
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.relatedPoster}
      />
      <Text style={styles.relatedTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.relatedYear}>
        {new Date(item.release_date).getFullYear() || ''}
      </Text>
    </View>
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
            <Icon name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.movieTitle}>
              {movie.title} {movieYear}
            </Text>
            <Text style={styles.tagline}>{tagline}</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <Text style={styles.overview}>{movie.overview}</Text>
          <View style={styles.statsRow}>
            <View style={styles.userScoreContainer}>
              <Text style={styles.scoreValue}>{userScore}%</Text>
              <Text style={styles.scoreLabel}>User Score</Text>
            </View>
            <View style={styles.watchContainer}>
              <Text style={styles.whereLabel}>Where to watch</Text>
              <Icon name="apple" size={22} color="#000" style={{ marginHorizontal: 6 }} />
              <Text style={styles.tvText}>TV</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="heart-outline" size={20} color="#206A4E" />
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="playlist-plus" size={20} color="#206A4E" />
              <Text style={styles.actionText}>To list...</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Related movies</Text>
          {relatedMovies.length > 0 ? (
            <FlatList
              data={relatedMovies}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
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
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.45,
    justifyContent: 'flex-end',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  heroContent: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 16,
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  userScoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#206A4E',
    marginRight: 6,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#333',
  },
  watchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  whereLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tvText: {
    fontSize: 14,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#206A4E',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  relatedCard: {
    width: 100,
    marginRight: 12,
  },
  relatedPoster: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  relatedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  relatedYear: {
    fontSize: 12,
    color: '#666',
  },
  noRelated: {
    fontSize: 14,
    color: '#666',
  },
});
