import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import HeaderBar from '../components/HeaderBar';
import FooterNav from '../components/FooterNav';
import MovieSection from '../components/MovieSection';
import MovieCardVertical from '../components/MovieCardVertical';
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchFreeToWatch,
  fetchMoviesByQuery,
} from '../lib/tmdb';
import { useTheme } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import { Movie } from '../lib/tmdb';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowHeight = Dimensions.get('window').height;

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

      <View style={styles.scrollContainer}>
        <Searchbar
          placeholder="Search movies"
          value={query}
          onChangeText={setQuery}
          onIconPress={Keyboard.dismiss}
          style={styles.searchbar}
          icon={() => <Icon name="magnify" size={24} color={theme.colors.outline} />}
          inputStyle={styles.searchbarInput}
        />

        {query.length > 0 ? (
          searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MovieCardVertical movie={item} onPress={handleMoviePress} />
              )}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.resultsContainer}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results found</Text>
              <Icon name="emoticon-sad-outline" size={40} color="#999" style={styles.noResultsIcon} />
            </View>
          )
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
      </View>

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
    paddingHorizontal: 16,
  },
  searchbar: {
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: '#eaefe9ff',
  },
  searchbarInput: {
    fontFamily: 'Lexend Deca',
    fontSize: 16,
  },
  noResults: {
    height: windowHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 22,
    fontWeight: '400',
    fontFamily: 'Lexend Deca',
    color: '#999',
  },
  noResultsIcon: {
    marginTop: 8,
  },
  resultsContainer: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
