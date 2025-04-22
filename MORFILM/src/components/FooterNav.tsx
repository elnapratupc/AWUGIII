import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Route = {
  key: 'home' | 'search' | 'reels';
  title: string;
  icon: string;
};

export default function FooterNav() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [index, setIndex] = useState(0);

  const routes: Route[] = [
    { key: 'home', title: 'Home', icon: 'home-outline' },
    // { key: 'search', title: 'Search', icon: 'magnify' },
    // { key: 'reels', title: 'Reels', icon: 'movie-roll' },
  ];

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    const selectedRoute = routes[newIndex].key;

    if (selectedRoute === 'home') navigation.navigate('Home');
    // if (selectedRoute === 'search') navigation.navigate('Search');
    // if (selectedRoute === 'reels') navigation.navigate('Reels');
  };

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) =>
        handleIndexChange(routes.findIndex(r => r.key === route.key))
      }
      getLabelText={({ route }) => route.title}
    />
  );
}
