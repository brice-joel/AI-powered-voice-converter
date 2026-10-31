---
name: typescript-strict
description: Règles de typage TypeScript strict pour éliminer les bugs à la compilation.
---

# Standards TypeScript Strict

Ce skill régit les règles de typage pour tout le code frontend React Native.

## 1. Configuration Stricte
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`

## 2. Règles de Code
- **Bannir `any`** : Utiliser `unknown` si le type est imprévisible, puis affiner avec des type guards (`typeof`, `instanceof`).
- **Typage des Entités Métier** :
  - Définir des types précis pour les statuts d'enregistrement : `'idle' | 'recording' | 'processing' | 'ready' | 'error'`.
  - Définir des types précis pour les presets audio : `'girl' | 'grandfather' | 'deep_man' | 'robot' | 'chipmunk'`.
- **Contrats d'API** :
  - Chaque réponse API doit posséder son interface TypeScript miroir des schémas Pydantic du backend.

