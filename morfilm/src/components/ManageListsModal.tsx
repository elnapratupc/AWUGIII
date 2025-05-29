import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../lib/supabaseClient';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onRefresh: () => void;
}

export default function ManageListsModal({ visible, onClose, userId, onRefresh }: Props) {
  const [lists, setLists] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { data } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      setLists(data || []);
    })();
  }, [visible, userId]);

  const handleDelete = async (listId: string) => {
  console.log('🗑️ Elimina directa', listId);
  // Elimina primer totes les pel·lícules associades a la llista
  const { error: movieError } = await supabase.from('movie_lists').delete().eq('list_id', listId);
  if (movieError) {
    console.log('[movie_lists] DELETE ERROR:', movieError);
    Alert.alert('Error movie_lists', movieError.message);
    return;
  }

  // Després elimina la llista
  const { error: listError } = await supabase.from('lists').delete().eq('id', listId);
  if (listError) {
    console.log('[lists] DELETE ERROR:', listError);
    Alert.alert('Error lists', listError.message);
    return;
  }

  setLists((prev) => prev.filter((l) => l.id !== listId));
  onRefresh();
};


  const handleEdit = (list: any) => {
    setEditingId(list.id);
    setEditingName(list.name);
  };

  const handleSaveEdit = async (listId: string) => {
    if (!editingName.trim()) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }
    await supabase.from('lists').update({ name: editingName }).eq('id', listId);
    setEditingId(null);
    setEditingName('');
    (async () => {
      const { data } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      setLists(data || []);
      onRefresh();
    })();
  };

  const handleCreate = async () => {
    if (!newListName.trim()) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }
    await supabase.from('lists').insert({ user_id: userId, name: newListName });
    setNewListName('');
    (async () => {
      const { data } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      setLists(data || []);
      onRefresh();
    })();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.header}>Manage Lists</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            {lists.map((list) =>
              editingId === list.id ? (
                <View key={list.id} style={styles.listRow}>
                  <TextInput
                    value={editingName}
                    onChangeText={setEditingName}
                    style={[styles.input, { flex: 1 }]}
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => handleSaveEdit(list.id)}>
                    <Icon name="check" size={22} color="#206A4E" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View key={list.id} style={styles.listRow}>
                  <Icon name="folder-outline" size={20} color="#206A4E" />
                  <Text style={{ flex: 1, marginLeft: 10 }}>{list.name}</Text>
                  <TouchableOpacity onPress={() => handleEdit(list)}>
                    <Icon name="pencil" size={20} color="#444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(list.id)}>
  <Icon name="trash-can-outline" size={20} color="#ba1a1a" style={{ marginLeft: 8 }} />
</TouchableOpacity>
                </View>
              )
            )}
          </ScrollView>
          <View style={[styles.listRow, { marginTop: 16 }]}>
            <Icon name="plus-circle-outline" size={20} color="#206A4E" />
            <TextInput
              placeholder="Create new list..."
              value={newListName}
              onChangeText={setNewListName}
              style={[styles.input, { flex: 1, marginLeft: 10 }]}
              onSubmitEditing={handleCreate}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleCreate}>
              <Icon name="check" size={22} color="#206A4E" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '92%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5fbf5',
    padding: 8,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    padding: 6,
    fontSize: 16,
  },
});
