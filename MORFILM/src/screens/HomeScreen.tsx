import React, { useEffect, useState } from 'react';
//import { useTheme } from 'react-native-paper';
import { MorfilmLightTheme, MorfilmDarkTheme } from '../theme/morfilmTheme';
import { useColorScheme } from 'react-native';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import {
  Movie,
  Trailer,
  fetchPopularMovies,
  fetchTrailersFromMovies,
  fetchFreeToWatch,
  fetchTrendingMovies
} from '../lib/tmdb';
import { supabase } from '../lib/supabaseClient';
import FooterNav from '../components/FooterNav';
import HeaderBar from '../components/HeaderBar';
import MovieSection from '../components/MovieSection';
import TrailerSection from '../components/TrailerSection';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<Movie[]>([]);
  const colorScheme = useColorScheme() ?? 'light';  

  const getThemeSurface = (scheme: 'light' | 'dark' | null) => {
  const color = scheme === 'dark'
    ? MorfilmDarkTheme.colors.surface
    : MorfilmLightTheme.colors.surface;
};

  const backgroundColor = getThemeSurface(colorScheme);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const trendingMovies = await fetchTrendingMovies();
        setMovies(trendingMovies);
  
        const trendingTrailers = await fetchTrailersFromMovies(trendingMovies);
        setTrailers(trendingTrailers);
  
        const freeMovies = await fetchFreeToWatch();
        setFreeToWatch(freeMovies);
        
      } catch (error) {
        console.error('Error carregant contingut:', error);
      }
    };
  
    loadContent();
  }, []);  

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSelectMovie = (movie: Movie) => {
    navigation.navigate('Details', { movie });
  };

  

  return (
    <View style={[styles.container, { backgroundColor}]}>
      <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <HeaderBar onLogout={handleLogout} showWelcome={true} />
  
        {/* Trending */}
        <MovieSection
          title="Trending"
          icon="fire"
          movies={movies}
          onSelectMovie={handleSelectMovie}
        />
  
        {/* Latest Trailers */}
        <TrailerSection
          title="Latest Trailers"
          icon="movie"
          trailers={trailers}
        />
  
        {/* Free to Watch */}
        <MovieSection
          title="Free to Watch"
          icon="eye"
          movies={freeToWatch}
          onSelectMovie={handleSelectMovie}
        />
        
      </ScrollView>
  
      {/* Footer */}
      <View style={styles.footer}>
        <FooterNav />
      </View>
    </View>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginLeft: 16,
  },
  icon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
  },

});
