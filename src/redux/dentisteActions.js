// src/redux/dentisteActions.js
import {
  PLANNING_SET_DATE, PLANNING_SET_VUE,
  DOSSIER_SET_PATIENT_ACTIF, DOSSIER_ADD_CONSULTATION, DOSSIER_ADD_NOTE,
  TRAITEMENT_ADD_SUCCESS, TRAITEMENT_UPDATE_SUCCESS, ACTE_ADD_SUCCESS,
  ORDONNANCE_ADD_SUCCESS,
} from './dentisteTypes';

// ── Planning ──────────────────────────────────────────────────────────────────
export const setPlanningDate = (date) => ({ type: PLANNING_SET_DATE, payload: date });
export const setPlanningVue  = (vue)  => ({ type: PLANNING_SET_VUE,  payload: vue  });

// ── Dossiers médicaux ─────────────────────────────────────────────────────────
export const setPatientActif    = (patient) => ({ type: DOSSIER_SET_PATIENT_ACTIF, payload: patient });
export const addConsultation    = (data)    => ({ type: DOSSIER_ADD_CONSULTATION,  payload: { ...data, id: Date.now(), date: new Date().toLocaleDateString('fr-FR') } });
export const addNote            = (note)    => ({ type: DOSSIER_ADD_NOTE,          payload: note });

// ── Traitements ───────────────────────────────────────────────────────────────
export const addTraitement    = (t) => ({ type: TRAITEMENT_ADD_SUCCESS,    payload: { ...t, id: Date.now() } });
export const updateTraitement = (id, data) => ({ type: TRAITEMENT_UPDATE_SUCCESS, payload: { id, ...data } });
export const addActe          = (a) => ({ type: ACTE_ADD_SUCCESS,          payload: { ...a, id: Date.now(), date: new Date().toLocaleDateString('fr-FR') } });

// ── Ordonnances ───────────────────────────────────────────────────────────────
export const addOrdonnance = (o) => ({
  type: ORDONNANCE_ADD_SUCCESS,
  payload: {
    ...o,
    id:     Date.now(),
    date:   new Date().toLocaleDateString('fr-FR'),
    numero: `ORD-${Math.floor(Math.random() * 900) + 100}`,
  },
});