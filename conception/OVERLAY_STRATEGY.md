# Stratégie Technique de la Bulle Flottante (Android Overlay)

Ce document détaille l'implémentation de la fonctionnalité de bulle flottante sur Android, permettant d'enregistrer et de transformer un message vocal directement au-dessus de WhatsApp ou Telegram.

---

## 1. Principes & Permissions Android

L'affichage d'une vue par-dessus d'autres applications sous Android nécessite :
1. **La permission `SYSTEM_ALERT_WINDOW`** :
   ```xml
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
   ```
   L'utilisateur doit l'accorder manuellement dans les paramètres système Android ("Afficher par-dessus d'autres applications").
2. **Un `Foreground Service` avec notification persistante** :
   Pour éviter qu'Android ne tue le processus en arrière-plan lorsque l'utilisateur est dans WhatsApp.
   ```xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
   ```

---

## 2. Architecture Technique (React Native + Expo)

Puisque nous utilisons **Expo avec Prebuild (Continuous Native Generation)**, nous disposons du meilleur des deux mondes :

1. **Option A : Module Existant (`react-native-float-bubble` ou `react-native-draw-overlay`)**
   - Intégrable via un plugin de configuration Expo (`app.plugin.js`).
   - Gère l'affichage de l'icône flottante draggable et l'événement `onClick`.

2. **Option B : Module Natif Dédié en Kotlin**
   - Crée un `WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY`.
   - Ajoute une vue flottante avec gestion du drag & drop au toucher.
   - Émet des événements vers React Native lors du maintien (Start Record) et du relâchement (Stop Record).

---

## 3. Flux Utilisateur avec la Bulle Flottante

```text
[Utilisateur dans une discussion WhatsApp]
                    │
                    ▼
[Appui long sur la bulle flottante VoiceMorph]
                    │
        (Enregistrement du micro en tâche de fond)
                    │
                    ▼
[Relâchement de la bulle]
                    │
        (Affichage d'un mini-menu de 3 icônes d'avatars au-dessus de la bulle)
                    │
                    ▼
[Clic sur l'avatar souhaité (ex: Fille)]
                    │
        (Envoi rapide au backend FastAPI & réception du .ogg en < 500ms)
                    │
                    ▼
[Lancement automatique de l'Intent Android SEND vers WhatsApp]
                    │
                    ▼
[Le vocal est prêt à partir dans la conversation]
```

