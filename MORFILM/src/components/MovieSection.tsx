import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import { Movie } from '../lib/tmdb';
import MovieCard from './MovieCard';

interface Props {
  title: string;
  icon?: string; // Opcional: per mostrar una icona al costat del títol
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieSection({ title, icon, movies, onSelectMovie }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        {icon && <Icon source={icon} size={20} color={colors.onBackground} style={styles.icon} />}
        <Text variant="titleLarge">{title}</Text>
      </View>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  list: {
    paddingHorizontal: 8,
  },
});
