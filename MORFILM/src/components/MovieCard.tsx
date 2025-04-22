import React from 'react';
import { Card, Text } from 'react-native-paper';
import { Movie } from '../lib/tmdb';

interface Props {
  movie: Movie;
  onPress: (movie: Movie) => void;
  width?: number;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('ca-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function MovieCard({ movie, onPress, width = 140 }: Props) {
  return (
    <Card
      style={{ width, margin: 12 }}
      onPress={() => onPress(movie)}
    >
      <Card.Cover
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={{ aspectRatio: 2 / 3 }}
      />
      <Card.Content>
        <Text variant="labelLarge" numberOfLines={1}>
          {movie.title}
        </Text>
        <Text variant="bodySmall">
          {formatDate(movie.release_date)}
        </Text>
      </Card.Content>
    </Card>
  );
}
