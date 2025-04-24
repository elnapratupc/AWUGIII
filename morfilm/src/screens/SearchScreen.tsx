import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Keyboard } from 'react-native';
import { Searchbar } from 'react-native-paper';
import MovieCard from '../components/MovieCard';
import HeaderBar from '../components/HeaderBar';
import FooterNav from '../components/FooterNav';
import { useTheme } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchMoviesByQuery,
} from '../lib/tmdb';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const trending = await fetchTrendingMovies();
        const popular = await fetchPopularMovies();
        setTrendingMovies(trending);
        setPopularMovies(popular);
      } catch (err) {
        console.error('Error loading trending/popular movies:', err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await fetchMoviesByQuery(query);
        setMovies(results);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderBar onLogout={handleLogout} showWelcome={false} />

      <Searchbar
        placeholder="Search movies"
        value={query}
        onChangeText={setQuery}
        onIconPress={Keyboard.dismiss}
        style={styles.searchbar}
        iconColor={theme.colors.outline}
        inputStyle={{ fontFamily: 'Lexend Deca' }}
      />

      {query.length === 0 ? (
        <View style={styles.placeholderSections}>
          {/* Aquí puedes usar componentes para mostrar trendingMovies y popularMovies */}
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => <MovieCard movie={item} onPress={handleMoviePress} />}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      )}

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#eaefe9ff',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  placeholderSections: {
    flex: 1,
  },
});
  