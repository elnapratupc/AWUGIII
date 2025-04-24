import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<Movie[]>([]);
  const { colors } = useTheme();

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
        console.error('Error fetching movies:', e);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSelectMovie = (movie: Movie) => {
    navigation.navigate('Details', { movie });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/*Header està dins del ScrollView */}
        <HeaderBar onLogout={handleLogout} showWelcome={true} />
  
        {/*Trending */}
        <View style={styles.sectionTitleRow}>
          <Icon name="fire" size={22} color={colors.onBackground} style={styles.icon} />
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Trending</Text>
        </View>
        <MovieSection movies={movies} onSelectMovie={handleSelectMovie} />
  
        {/*Latest Trailers */}
        <View style={styles.sectionTitleRow}>
          <Icon name="movie" size={22} color={colors.onBackground} style={styles.icon} />
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Latest Trailers</Text>
        </View>
        <TrailerSection trailers={trailers} />
  
        {/*Veure gratis, secció encara per fer */}
        
      </ScrollView>
  
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
