import httpx
import os
import sys

API_URL = "http://127.0.0.1:8000/api/v1"

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

    # 3. Création ou utilisation d'un fichier audio de test
    sample_file = "test_sample.wav"
    if not os.path.exists(sample_file):
        print("\n3. Génération d'un fichier audio de test WAV...")
        # Génère 3 secondes de bip sinusoïdal à 440Hz
        ret = os.system('ffmpeg -y -f lavfi -i "sine=frequency=440:duration=3" test_sample.wav')
        if ret != 0 or not os.path.exists(sample_file):
            print("   [INFO] FFmpeg CLI non trouvé pour générer le son de test.")
            print("   Création d'un fichier binaire WAV d'exemple...")
            # En-tête WAV 44 bytes minimal pour le test
            with open(sample_file, "wb") as f:
                f.write(b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00')
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
