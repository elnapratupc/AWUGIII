import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Movie } from '../lib/tmdb';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // 16 + 16 + 8 entre targetes

export default function MovieCardVertical({
  movie,
  onPress,
}: {
  movie: Movie;
  onPress: (movie: Movie) => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie)}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.date}>{movie.release_date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eaefe9',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
    width: cardWidth,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  info: {
    padding: 12,
  },
  title: {
    fontFamily: 'Lexend Deca',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  date: {
    fontFamily: 'Lexend Deca',
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
});
