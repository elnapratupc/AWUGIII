import React from 'react';
import { Text } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { Movie } from '../lib/tmdb';
import MovieCard from './MovieCard';

interface Props {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieSection({ title, movies, onSelectMovie }: Props) {
  return (
    <View>
      <Text variant="titleLarge" style={{ marginLeft: 16, marginTop: 8 }}>{title}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} onPress={onSelectMovie} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
}
