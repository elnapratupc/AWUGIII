import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';
import { API_URL } from '../api/tmdb';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [trailers, setTrailers] = useState([]);

  // Pel·lícules populars
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error carregant pel·lícules:', error);
      }
    };

    fetchMovies();
  }, []);

  // Tràilers de les primeres pel·lis populars
  useEffect(() => {
    const fetchTrailersFromPopular = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const popularMovies = data.results.slice(0, 5);
        const trailersData = [];

        for (const movie of popularMovies) {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=2903fc4c6bd618022e8965d44f45e020`
          );
          const vidData = await res.json();
          const trailer = vidData.results.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          );
          if (trailer) {
            trailersData.push({ ...trailer, movieTitle: movie.title });
          }
        }

        setTrailers(trailersData);
      } catch (error) {
        console.error('Error carregant tràilers:', error);
      }
    };

    fetchTrailersFromPopular();
  }, []);

  // Card pel·lis
  const renderMovieCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={textStyles.labelLarge} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={[textStyles.bodySmall, { color: '#404943' }]}>
        {new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  // Card tràilers
  const renderTrailerCard = ({ item }) => {
    const youtubeThumbnail = `https://img.youtube.com/vi/${item.key}/hqdefault.jpg`;

    return (
      <View style={styles.trailerCard}>
        <Image source={{ uri: youtubeThumbnail }} style={styles.trailerThumbnail} />
        <View style={styles.trailerRow}>
          <View style={{ flex: 1 }}>
            <Text style={textStyles.labelLarge} numberOfLines={1}>
              {item.movieTitle}
            </Text>
            <Text style={[textStyles.bodySmall, { color: '#404943' }]}>Tonight</Text>
          </View>
          <Icon name="play-circle-outline" size={24} color="#171d1a" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.topBar}>
          <Icon name="account-circle-outline" size={20} color="#171d1a" />
          <Icon name="cog-outline" size={20} color="#171d1a" />
        </View>

        <Text style={[textStyles.headlineSmall, styles.welcome]}>Welcome.</Text>

        <View style={styles.trendingRow}>
          <Icon name="fire" size={22} color="#171d1a" style={styles.trendingIcon} />
          <Text style={textStyles.titleLarge}>Trending</Text>
        </View>

        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={renderMovieCard}
        />

        <View style={styles.trailersRow}>
          <Icon name="movie" size={22} color="#171d1a" style={styles.trailersIcon} />
          <Text style={textStyles.titleLarge}>Latest Trailers</Text>
        </View>

        <FlatList
          data={trailers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={renderTrailerCard}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    marginTop: 16,
    marginBottom: 16,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  trendingIcon: {
    marginRight: 10,
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
  carousel: {
    paddingRight: 8,
    marginTop: 16,
  },
  trailersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  trailersIcon: {
    marginRight: 10,
  },
  trailerCard: {
    width: 240,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
  },
  trailerThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  trailerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
