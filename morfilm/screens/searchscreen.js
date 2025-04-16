import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { textStyles } from '../theme/typography';
import FooterNav from '../components/footerNav';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=2903fc4c6bd618022e8965d44f45e020&query=${encodeURIComponent(query)}&language=en-US&page=1`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.log('Error searching movies:', error);
    }
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movie: item })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={textStyles.labelLarge} numberOfLines={1}>
        {item.title}
      </Text>
      {item.release_date ? (
        <Text style={[textStyles.bodySmall, { color: '#404943' }]}>
          {new Date(item.release_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      ) : (
        <Text style={[textStyles.bodySmall, { color: '#404943' }]}>—</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search movie..."
            placeholderTextColor="#999"
            onChangeText={setQuery}
            value={query}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Icon name="magnify" size={24} color="#171d1a" />
          </TouchableOpacity>
        </View>

        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieCard}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        ) : (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Try searching for a movie!</Text>
          </View>
        )}
      </View>
      {/* Si deseas agregar el footer, descomenta la siguiente línea */}
      { <FooterNav /> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#f5fbf5',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginRight: 8,
    color: '#000',
  },
  grid: {
    paddingBottom: 16,
  },
  card: {
    width: (width - 48) / 2,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    margin: 8,
    alignItems: 'flex-start',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
