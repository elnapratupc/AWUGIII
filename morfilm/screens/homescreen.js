import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';
import { API_URL } from '../api/tmdb';
import { Image } from 'react-native';
import { FlatList } from 'react-native';

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

        <FlatList
  data={movies}
  keyExtractor={(item) => item.id.toString()}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.carousel}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={textStyles.titleSmall}>{item.title}</Text>
      <Text style={textStyles.bodySmall}>
        {new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </View>
  )}
/>


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
  movieList: {
    marginTop: 16,
    marginLeft: 16,
    gap: 16,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    width: 160,
    backgroundColor: '#e4eae4', // surface container high
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  poster: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
  },
  carousel: {
    paddingLeft: 16,
    paddingRight: 8,
    marginTop: 16,
  },
  
  
});

export default HomeScreen;
