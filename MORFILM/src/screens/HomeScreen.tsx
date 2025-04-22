import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Movie,
  Trailer,
  fetchPopularMovies,
  fetchTrailersFromMovies,
  fetchFreeToWatch
} from '../lib/tmdb';
import { supabase } from '../lib/supabaseClient';
import FooterNav from '../components/FooterNav';
import HeaderBar from '../components/HeaderBar';
import MovieSection from '../components/MovieSection';
import TrailerSection from '../components/TrailerSection';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<Movie[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const m = await fetchPopularMovies();
        const t = await fetchTrailersFromMovies(m);
        const f = await fetchFreeToWatch();
        setMovies(m);
        setTrailers(t);
        setFreeToWatch(f);
      } catch (e) {
        console.error('Error carregant dades:', e);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSelectMovie = (movie: Movie) => {
    //navigation.navigate('Details', { movie });
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar onLogout={handleLogout} />
  
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MovieSection title="Trending" movies={movies} onSelectMovie={handleSelectMovie} />
        <TrailerSection trailers={trailers} />
        <MovieSection title="Veure gratis" movies={freeToWatch} onSelectMovie={handleSelectMovie} />
      </ScrollView>
  
      <View style={styles.footer}>
        <FooterNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  scrollContainer: {
    paddingBottom: 120,
  },
  
});
