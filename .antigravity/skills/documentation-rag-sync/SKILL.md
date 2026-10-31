---
name: documentation-rag-sync
description: Maintient la documentation technique et client synchronisée avec le code, avec un format optimisé pour les systèmes RAG (Retrieval-Augmented Generation).
---

# Skill : Synchronisation de Documentation Optimisée pour RAG

Ce skill garantit que toute modification du code est répercutée dans le dossier `documentation/` sous un format conçu pour l'ingestion par les systèmes RAG (embeddings sémantiques et recherche vectorielle).

---

## 1. Directives pour les Agents IA

### Règle 1 : Synchronisation Obligatoire
- Chaque fois qu'une route API est ajoutée ou modifiée dans `backend/app/api/`, mettre à jour `documentation/API_REFERENCE.md`.
- Chaque fois qu'un filtre audio ou un avatar est ajusté dans `backend/app/services/dsp_service.py`, mettre à jour `documentation/AUDIO_PIPELINE.md` et `documentation/USER_GUIDE.md`.
- Chaque fois qu'un comportement utilisateur ou un correctif de bug est apporté, ajouter la question/réponse correspondante dans `documentation/FAQ.md`.

### Règle 2 : Structure des Documents RAG
- **Frontmatter YAML obligatoire** en tête de chaque fichier Markdown :
  ```markdown
  ---
  category: <client-guide | technical-reference | technical-deepdive | faq | architecture>
  target_audience: <end-users | developers | architects | all>
  tags: [liste, de, mots, clés]
  last_updated: AAAA-MM-JJ
  ---
  ```
- **Sections Indépendantes (Chunks)** : Chaque section `##` ou `###` doit être formulée de façon auto-porteuse, sans dépendre du paragraphe précédent pour sa compréhension.
- **Titres Sémantiques Précis** : Préférer `### Q : Comment activer la bulle flottante sur Android ?` plutôt que `### Bulle`.
