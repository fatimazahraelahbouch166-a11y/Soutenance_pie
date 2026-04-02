// src/redux/dentisteTypes.js

// ── Planning ──────────────────────────────────────────────────────────────────
export const PLANNING_LOAD_SUCCESS = 'PLANNING_LOAD_SUCCESS';
export const PLANNING_SET_DATE     = 'PLANNING_SET_DATE';
export const PLANNING_SET_VUE      = 'PLANNING_SET_VUE';

// ── Dossiers médicaux ─────────────────────────────────────────────────────────
export const DOSSIER_LOAD_SUCCESS       = 'DOSSIER_LOAD_SUCCESS';
export const DOSSIER_SET_PATIENT_ACTIF  = 'DOSSIER_SET_PATIENT_ACTIF';
export const DOSSIER_ADD_CONSULTATION   = 'DOSSIER_ADD_CONSULTATION';
export const DOSSIER_ADD_NOTE           = 'DOSSIER_ADD_NOTE';

// ── Traitements ───────────────────────────────────────────────────────────────
export const TRAITEMENT_ADD_SUCCESS    = 'TRAITEMENT_ADD_SUCCESS';
export const TRAITEMENT_UPDATE_SUCCESS = 'TRAITEMENT_UPDATE_SUCCESS';
export const ACTE_ADD_SUCCESS          = 'ACTE_ADD_SUCCESS';

// ── Ordonnances ───────────────────────────────────────────────────────────────
export const ORDONNANCE_ADD_SUCCESS  = 'ORDONNANCE_ADD_SUCCESS';
export const ORDONNANCE_LOAD_SUCCESS = 'ORDONNANCE_LOAD_SUCCESS';

// ── Statistiques ──────────────────────────────────────────────────────────────
export const STATS_LOAD_SUCCESS = 'STATS_LOAD_SUCCESS';