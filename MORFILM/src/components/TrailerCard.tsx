import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { Linking } from 'react-native';

interface Props {
  trailer: {
    id: string;
    key: string;
    movieTitle: string;
    published_at?: string;
  };
}

const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString('ca-ES', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

export default function TrailerCard({ trailer }: Props) {
  const { colors } = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surfaceVariant }]}
      mode="contained"
    >
      <Card.Cover
        source={{ uri: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg` }}
        style={styles.thumbnail}
      />
      <Card.Content style={{ paddingHorizontal: 8, paddingBottom: 4 }}>
        <Text
          variant="labelLarge"
          numberOfLines={1}
          style={{ color: colors.onSurfaceVariant }}
        >
          {trailer.movieTitle}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {formatDate(trailer.published_at)}
        </Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="play-circle-outline"
          onPress={() =>
            Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)
          }
          iconColor={colors.primary}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 120,
  },
});
