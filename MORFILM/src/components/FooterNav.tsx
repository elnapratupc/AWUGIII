import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function FooterNav() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { key: 'Home', label: 'Home', icon: 'home-outline' },
    { key: 'Search', label: 'Search', icon: 'magnify' },
    { key: 'Reels', label: 'Reels', icon: 'movie-roll' },
  ];

  return (
    <View style={styles.footerContainer}>
      {tabs.map((tab) => {
        const focused = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => {
              setActiveTab(tab.key);
              navigation.navigate(tab.key);
            }}
          >
            <View
              style={[
                styles.iconWrapper,
                focused && styles.activeIconWrapper,
              ]}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={focused ? '#171d1a' : '#404943'}
              />
            </View>
            <Text style={[styles.navText, focused && styles.activeText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 0,
    backgroundColor: '#EAEFE9',
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 20,
  },
  activeIconWrapper: {
    backgroundColor: '#dff3e0',
  },
  navText: {
    fontSize: 12,
    color: '#404943',
    marginTop: 4,
  },
  activeText: {
    fontWeight: '600',
    color: '#171d1a',
  },
});
