import React, { useEffect, useState } from 'react'; // ✅ import unificat
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';
import { API_URL } from '../api/tmdb';
import { Image } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);

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

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.innerContainer}>

        <View style={styles.topBar}>
          <Icon name="account-circle-outline" size={20} color="#171d1a" />
          <Icon name="cog-outline" size={20} color="#171d1a" />
        </View>

        <Text style={[textStyles.headlineSmall, styles.welcome]}>
          Welcome.
        </Text>

        <View style={styles.trendingRow}>
          <Icon name="fire" size={22} color="#171d1a" style={styles.trendingIcon} />
          <Text style={textStyles.titleLarge}>Trending</Text>
        </View>

        <View style={styles.movieList}>
  {movies.map((movie) => (
    <View key={movie.id} style={styles.movieCard}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={textStyles.titleMedium}>{movie.title}</Text>
        <Text style={textStyles.bodySmall}>{movie.release_date}</Text>
      </View>
    </View>
  ))}
</View>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#f5fbf5',
    paddingHorizontal: 24,
    paddingTop: 48,
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
  movieList: {
    marginTop: 16,
    marginLeft: 16,
    gap: 6, // només si tens React Native 0.71+
  },
});

export default HomeScreen;
