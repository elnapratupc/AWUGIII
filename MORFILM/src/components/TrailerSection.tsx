import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import TrailerCard from './TrailerCard';

interface Props {
  trailers: {
    id: string;
    key: string;
    movieTitle: string;
    published_at?: string;
  }[];
}

export default function TrailerSection({ trailers }: Props) {
  return (
    <View>
      <Text variant="titleLarge" style={{ marginLeft: 16, marginTop: 24 }}>
        Tràilers recents
      </Text>
      <FlatList
        data={trailers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrailerCard trailer={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
}
