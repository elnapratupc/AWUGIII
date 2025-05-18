import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import TrailerCard from './TrailerCard';

interface Props {
  title?: string;
  icon?: string;
  trailers: {
    id: string;
    key: string;
    movieTitle: string;
    published_at?: string;
  }[];
}

export default function TrailerSection({ title, icon, trailers }: Props) {
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
        data={trailers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrailerCard trailer={item} />}
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
    fontSize: 22, // material-theme/title/large
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
