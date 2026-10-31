import httpx
import os
import sys
import wave
import struct
import math

API_URL = "http://127.0.0.1:8000/api/v1"

def create_synthetic_wav(filename: str = "test_sample.wav", duration_sec: float = 2.5) -> str:
    """Génère un fichier vocal WAV 44.1kHz 16-bit mono sans dépendance externe."""
    sample_rate = 44100
    n_samples = int(sample_rate * duration_sec)
    
    with wave.open(filename, "w") as wav_out:
        wav_out.setnchannels(1)      # Mono
        wav_out.setsampwidth(2)     # 16 bits
        wav_out.setframerate(sample_rate)
        
        # Synthétise un son sinusoïdal doux à 300Hz (proche de la voix humaine)
        for i in range(n_samples):
            # Modulation de fréquence pour simuler une intonation de parole
            freq = 280.0 + 40.0 * math.sin(2.0 * math.pi * 1.5 * (i / sample_rate))
            value = int(16000.0 * math.sin(2.0 * math.pi * freq * (i / sample_rate)))
            wav_out.writeframesraw(struct.pack("<h", value))
            
    return filename

def test_pipeline():
    print("=" * 60)
    print("VoiceMorph - Test Automatisé du Backend")
    print("=" * 60)

    # 1. Vérification du Health Check
    print("\n1. Test de disponibilité du backend (GET /health)...")
    try:
        res = httpx.get(f"{API_URL}/health", timeout=5.0)
        data = res.json()
        print(f"   [OK] Statut : {data.get('status')}")
        print(f"   [OK] FFmpeg détecté : {data.get('ffmpeg_available')}")
        if not data.get('ffmpeg_available'):
            print("   [ATTENTION] FFmpeg n'est pas encore détecté par le backend.")
    except Exception as e:
        print(f"   [ERREUR] Impossible de joindre le serveur à {API_URL}.")
        print("   Vérifiez que le serveur uvicorn est bien lancé.")
        print(f"   Détail : {e}")
        return

    # 2. Récupération des Presets
    print("\n2. Récupération des avatars vocaux (GET /presets/)...")
    try:
        res = httpx.get(f"{API_URL}/presets/", timeout=5.0)
        presets = res.json().get("presets", [])
        print(f"   [OK] {len(presets)} voix disponibles :")
        for p in presets:
            print(f"        - [{p['id']}] {p['name']} : {p['description']}")
    except Exception as e:
        print(f"   [ERREUR] Échec de la récupération des presets : {e}")
        return

    # 3. Génération du fichier audio WAV de test en pur Python
    sample_file = "test_sample.wav"
    if not os.path.exists(sample_file):
        print(f"\n3. Génération d'un fichier audio vocal de test ({sample_file})...")
        create_synthetic_wav(sample_file, duration_sec=3.0)
        print(f"   [OK] Fichier vocal synthétique créé ({os.path.getsize(sample_file)} octets)")
    else:
        print(f"\n3. Utilisation de l'échantillon audio existant : {sample_file}")

    # 4. Envoi pour transformation vocale
    target_preset = "girl"
    print(f"\n4. Envoi de l'audio au endpoint de conversion (POST /convert avec preset '{target_preset}')...")
    try:
        with open(sample_file, "rb") as audio_fp:
            files = {"audio": ("sample.wav", audio_fp, "audio/wav")}
            data = {"preset": target_preset}
            response = httpx.post(f"{API_URL}/convert", files=files, data=data, timeout=30.0)

        if response.status_code == 200:
            out_filename = f"output_whatsapp_{target_preset}.ogg"
            with open(out_filename, "wb") as out_fp:
                out_fp.write(response.content)
            print(f"   [SUCCÈS] Vocal transformé généré avec succès : {out_filename}")
            print(f"   [INFO] Taille du fichier : {len(response.content)} octets")
            print("   [INFO] Format : OGG Opus 32kbps mono (Prêt pour WhatsApp & Telegram PTT)")
        else:
            print(f"   [ERREUR HTTP {response.status_code}] : {response.text}")
    except Exception as e:
        print(f"   [ERREUR] Échec de la requête de conversion : {e}")

    print("\n" + "=" * 60)
    print("Fin du test !")
    print("=" * 60)

if __name__ == "__main__":
    test_pipeline()
