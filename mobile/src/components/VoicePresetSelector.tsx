import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { VoicePreset, VoicePresetId } from '../types';

interface Props {
  presets: VoicePreset[];
  selectedPreset: VoicePresetId;
  onSelectPreset: (id: VoicePresetId) => void;
}

export const VoicePresetSelector: React.FC<Props> = ({
  presets,
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez un avatar vocal :</Text>
      <FlatList
        data={presets}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedPreset;
          return (
            <TouchableOpacity
              style={[styles.presetCard, isSelected && styles.presetCardSelected]}
              onPress={() => onSelectPreset(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetName, isSelected && styles.presetTextSelected]}>
                {item.name}
              </Text>
              <Text style={styles.presetDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  presetCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 8,
    width: 140,
    borderWidth: 2,
    borderColor: '#334155',
  },
  presetCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#0f172a',
  },
  presetName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 4,
  },
  presetTextSelected: {
    color: '#38bdf8',
  },
  presetDescription: {
    fontSize: 11,
    color: '#64748b',
  },
});

