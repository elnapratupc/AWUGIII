import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { Searchbar } from 'react-native-paper';
import HeaderBar from '../components/HeaderBar';
import FooterNav from '../components/FooterNav';
import MovieSection from '../components/MovieSection';
import { fetchPopularMovies, fetchTrendingMovies, fetchFreeToWatch, fetchMoviesByQuery } from '../lib/tmdb';
import { useTheme } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import { Movie } from '../lib/tmdb';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<Movie[]>([]);
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const trending = await fetchTrendingMovies();
        const popular = await fetchPopularMovies();
        const free = await fetchFreeToWatch();

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setFreeToWatch(free);
      } catch (err) {
        console.error('Error loading initial movies:', err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const results = await fetchMoviesByQuery(query);
          setSearchResults(results);
        } catch (err) {
          console.error('Error fetching search results:', err);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Details', { movie });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar onLogout={handleLogout} showWelcome={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Searchbar
          placeholder="Search movies"
          value={query}
          onChangeText={setQuery}
          onIconPress={Keyboard.dismiss}
          style={styles.searchbar}
          iconColor={theme.colors.outline}
          inputStyle={{ fontFamily: 'Lexend Deca' }}
        />

        {query.length > 0 ? (
          <MovieSection
            title="Search Results"
            icon="magnify"
            movies={searchResults}
            onSelectMovie={handleMoviePress}
          />
        ) : (
          <>
            <MovieSection
              title="Trending"
              icon="fire"
              movies={trendingMovies}
              onSelectMovie={handleMoviePress}
            />
            <MovieSection
              title="Popular Today"
              icon="chart-line"
              movies={popularMovies}
              onSelectMovie={handleMoviePress}
            />
            <MovieSection
              title="Free to Watch"
              icon="piggy-bank"
              movies={freeToWatch}
              onSelectMovie={handleMoviePress}
            />
          </>
        )}
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
  searchbar: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#eaefe9ff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});