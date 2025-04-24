import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Keyboard, ScrollView, Text, Icon } from 'react-native';
import { Searchbar } from 'react-native-paper'; // Material Design searchbar
import MovieCard from '../components/MovieCard';
import HeaderBar from '../components/HeaderBar'; 
import FooterNav from '../components/FooterNav'; 
import { useTheme } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const theme = useTheme();

  // Obtenir pel·lícules de tendència
  const fetchTrendingMovies = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US&page=1`);
      const data = await res.json();
      setTrendingMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  // Obtenir pel·lícules populars
  const fetchPopularMovies = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US&page=1`);
      const data = await res.json();
      setPopularMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };
  
  const fetchMovies = async () => {
    if (!query) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=2903fc4c6bd618022e8965d44f45e020&language=en-US&page=1&query=${query}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 500); // debounce

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
          {/* Importar i reutilitzar seccions com "Trending", "Popular today", etc. */}
        
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
    backgroundColor: '#eaefe9ff', // surface-container
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  placeholderSections: {
    flex: 1,
    // Carregar les seccions per defecte (modular)
  },
});