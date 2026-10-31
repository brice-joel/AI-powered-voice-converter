import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>À propos de VoiceMorph</Text>
        <Text style={styles.subtitle}>Spécifications & Confidentialité</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Format Audio WhatsApp PTT</Text>
          <Text style={styles.cardText}>
            Les enregistrements vocaux sont convertis en OGG Opus à 32 kbps mono (16 kHz).
            Ce format est le standard officiel utilisé par WhatsApp et Telegram pour afficher
            les notes vocales avec la waveform verte animée.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avatars Disponibles</Text>
          <Text style={styles.cardText}>
            • Fille / Aiguë : Pitch +4.5 demi-tons, formants clairs{"\n"}
            • Grand-père : Pitch -2.5 demi-tons avec tremolo{"\n"}
            • Homme Grave : Fréquences de poitrine amplifiées{"\n"}
            • Robot : Modulation flanger et résonance métallique{"\n"}
            • Chipmunk : Pitch très aigu humoristique
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Serveur Backend</Text>
          <Text style={styles.cardText}>
            API active : {process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.206:8000/api/v1'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
