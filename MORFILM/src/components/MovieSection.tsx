import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import { Movie } from '../lib/tmdb';
import MovieCard from './MovieCard';

interface Props {
  title?: string;
  icon?: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieSection({ title, icon, movies, onSelectMovie }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      {title && (
        <View style={styles.sectionTitleRow}>
          {icon && (
            <Icon source={icon} size={22} color={colors.onBackground} style={styles.icon} />
          )}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]} variant="titleLarge">
            {title}
          </Text>
        </View>
      )}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={onSelectMovie} width={140} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22, // Segons material-theme/title/large
    fontFamily: 'Lexend Deca',
    fontWeight: '400',
  },
  icon: {
    marginRight: 6,
  },
  list: {
    paddingHorizontal: 8,
  },
});