import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../lib/supabaseClient';

interface Props {
  visible: boolean;
  onClose: () => void;
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  };
}

interface ListItem {
  id: string;
  name: string;
}

export default function AddToListModal({ visible, onClose, movie }: Props) {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedListIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const fetchLists = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id);

    if (!error) setLists(data || []);
    else console.log('❌ FETCH LIST ERROR:', error.message);
  };

  const createNewList = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not found');
      console.log('❌ USER ERROR:', userError);
      return;
    }

    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        name: newListName,
      })
      .select()
      .single();

    if (error) {
      Alert.alert('Error creating list', error.message);
      console.log('❌ CREATE LIST ERROR:', error.message);
    } else {
      setLists((prev) => [...prev, data]);
      setSelectedListIds((prev) => new Set([...prev, data.id]));
      setNewListName('');
      setShowCreateInput(false);
    }
  };

  const applySelection = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    for (const listId of selectedListIds) {
      await supabase.from('movie_lists').insert({
        user_id: user.id,
        list_id: listId,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
    }
    Alert.alert('Success', 'Movie added to selected lists.');
    onClose();
  };

  useEffect(() => {
    if (visible) fetchLists();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add to lists...</Text>
          <Text style={styles.subtitle}>Select the lists you want to add this movie to, or create a new one.</Text>

          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleSelection(item.id)}
              >
                <Icon
                  name={selectedListIds.has(item.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20}
                  color="#206A4E"
                />
                <Text style={styles.listText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {showCreateInput ? (
            <View style={styles.createRow}>
              <TextInput
                placeholder="New list"
                value={newListName}
                onChangeText={setNewListName}
                style={styles.input}
              />
              <TouchableOpacity onPress={createNewList}>
                <Icon name="check-circle" size={24} color="#206A4E" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowCreateInput(true)}
              style={styles.createNewButton}
            >
              <Icon name="plus-circle-outline" size={20} color="#206A4E" />
              <Text style={styles.createNewText}>Create new list...</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.applyButton} onPress={applySelection}>
            <Text style={styles.applyButtonText}>✓ Apply selected</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listText: {
    marginLeft: 8,
    fontSize: 16,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    flex: 1,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  createNewText: {
    marginLeft: 6,
    color: '#206A4E',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#206A4E',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ba1a1a',
    fontSize: 14,
  },
});
