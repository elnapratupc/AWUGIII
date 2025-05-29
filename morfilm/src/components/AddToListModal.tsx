import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function AddToListModal({ visible, onClose, movie }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [selectedLists, setSelectedLists] = useState(new Set());

  useEffect(() => {
    if (visible) fetchLists();
  }, [visible]);

  // Carrega llistes de l'usuari i selecciona les que ja contenen la pel·lícula
  const fetchLists = async () => {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setLists(data);

      // Mira a quines llistes ja hi és la peli
      const { data: movieListData } = await supabase
        .from('movie_lists')
        .select('list_id')
        .eq('movie_id', movie.id)
        .eq('user_id', user.id);
      const selected = new Set((movieListData || []).map((ml) => ml.list_id));
      setSelectedLists(selected);
    }
  };

  const createNewList = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'Usuari no trobat');
      return;
    }
    const { data, error } = await supabase
      .from('lists')
      .insert({ user_id: user.id, name: newListName })
      .select()
      .single();
    if (error) {
      Alert.alert('Error creant la llista', error.message);
      return;
    }
    setLists((prev) => [...prev, data]);
    setNewListName('');
    setSelectedLists((prev) => new Set(prev).add(data.id));
  };

  // Quan prem una llista, selecciona/desselecciona
  const toggleList = (listId) => {
    setSelectedLists((prev) => {
      const copy = new Set(prev);
      if (copy.has(listId)) {
        copy.delete(listId);
      } else {
        copy.add(listId);
      }
      return copy;
    });
  };

  // Aplica els canvis (afegeix o treu la peli a les llistes seleccionades)
  const applyToLists = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Mira a quines llistes JA hi era la pel·lícula
    const { data: movieListData } = await supabase
      .from('movie_lists')
      .select('list_id')
      .eq('movie_id', movie.id)
      .eq('user_id', user.id);
    const already = new Set((movieListData || []).map((ml) => ml.list_id));

    // 2. Afegir a noves llistes
    const toAdd = [...selectedLists].filter((id) => !already.has(id));
    for (let list_id of toAdd) {
      await supabase.from('movie_lists').insert({
        user_id: user.id,
        list_id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
    }

    // 3. Esborrar de les llistes desmarcades
    const toRemove = [...already].filter((id) => !selectedLists.has(id));
    for (let list_id of toRemove) {
      await supabase
        .from('movie_lists')
        .delete()
        .eq('user_id', user.id)
        .eq('list_id', list_id)
        .eq('movie_id', movie.id);
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: '#0009', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, width: 320 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>Add to lists...</Text>
          <FlatList
            data={lists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleList(item.id)}
                style={{
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#206A4E',
                    backgroundColor: selectedLists.has(item.id) ? '#206A4E' : '#fff',
                    marginRight: 12,
                  }}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{ color: '#666', marginTop: 10 }}>No lists yet</Text>}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
            <TextInput
              placeholder="Create new list"
              value={newListName}
              onChangeText={setNewListName}
              style={{ flex: 1, borderColor: '#aaa', borderWidth: 1, borderRadius: 8, padding: 8 }}
            />
            <TouchableOpacity onPress={createNewList} style={{ marginLeft: 10, backgroundColor: '#206A4E', padding: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={applyToLists} style={{ marginTop: 20, backgroundColor: '#206A4E', padding: 14, borderRadius: 12 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Apply selected</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: '#206A4E', textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
