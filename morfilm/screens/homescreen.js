import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';
import { API_URL } from '../api/tmdb';
import { ScrollView } from 'react-native';


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

  const renderMovieCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text
        style={[textStyles.labelLarge]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
      <Text 
        style={[textStyles.bodySmall, { color: '#404943' }]}>
        {new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </View>
    
    
  );

  return (
    <SafeAreaView style={styles.outerContainer}>
  <ScrollView contentContainerStyle={styles.innerContainer}>
  {/* Top Bar */}
        <View style={styles.topBar}>
          <Icon name="account-circle-outline" size={20} color="#171d1a" />
          <Icon name="cog-outline" size={20} color="#171d1a" />
        </View>

        {/* Welcome Text */}
        <Text style={[textStyles.headlineSmall, styles.welcome]}>
          Welcome.
        </Text>

        {/* Trending Section */}
        <View style={styles.trendingRow}>
          <Icon name="fire" size={22} color="#171d1a" style={styles.trendingIcon} />
          <Text style={textStyles.titleLarge}>Trending</Text>
        </View>

        {/* Movies Carousel */}
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
    flexShrink: 1,
    alignSelf: 'flex-start',
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
    maxHeight: 300,
  },
  trailersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  trailersIcon: {
    marginRight: 10,
  },
  
});

export default HomeScreen;