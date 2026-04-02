// src/redux/dentisteReducer.js
import {
  PLANNING_SET_DATE, PLANNING_SET_VUE,
  DOSSIER_SET_PATIENT_ACTIF, DOSSIER_ADD_CONSULTATION, DOSSIER_ADD_NOTE,
  TRAITEMENT_ADD_SUCCESS, TRAITEMENT_UPDATE_SUCCESS, ACTE_ADD_SUCCESS,
  ORDONNANCE_ADD_SUCCESS,
} from './dentisteTypes';

const TODAY = new Date().toISOString().split('T')[0];

// ── Mock RDV planning ─────────────────────────────────────────────────────────
const MOCK_PLANNING = [
  { id: 1, patient: 'Amina Tazi',       heure: '09:00', motif: 'Détartrage + bilan',      statut: 'done',      date: TODAY, allergies: 'Pénicilline', antecedents: 'Aucun' },
  { id: 2, patient: 'Youssef El Fassi', heure: '10:00', motif: 'Couronne provisoire',     statut: 'confirmed', date: TODAY, allergies: null,          antecedents: 'Diabète type 2' },
  { id: 3, patient: 'Sara Chkouri',     heure: '11:30', motif: 'Urgence — douleur aiguë', statut: 'urgent',    date: TODAY, allergies: null,          antecedents: 'Grossesse 6 mois' },
  { id: 4, patient: 'Karim Mansouri',   heure: '14:00', motif: 'Implant — séance 2/4',    statut: 'pending',   date: TODAY, allergies: 'Aspirine',    antecedents: 'Hypertension' },
  { id: 5, patient: 'Nadia Berrada',    heure: '15:30', motif: 'Blanchiment séance 2/3',  statut: 'pending',   date: TODAY, allergies: null,          antecedents: 'Aucun' },
];

// ── Mock dossiers patients ────────────────────────────────────────────────────
const MOCK_DOSSIERS = [
  {
    id: 1, nom: 'Amina Tazi', age: 28, groupe_sanguin: 'A+',
    telephone: '+212 6 12 34 56 78', email: 'amina.tazi@gmail.com',
    allergies: 'Pénicilline', antecedents: 'Chirurgie appendiculaire 2019. Non fumeuse.',
    consultations: [
      { id: 1, date: '15/01/2025', motif: 'Détartrage + polissage',  diagnostic: 'Tartre modéré', notes: 'RAS post-traitement' },
      { id: 2, date: '03/11/2024', motif: 'Carie dent 36',           diagnostic: 'Carie classe II', notes: 'Obturation composite posée' },
    ],
    traitements: [
      { id: 1, intitule: 'Détartrage semestriel', statut: 'termine', date_debut: '15/01/2025', date_fin: '15/01/2025' },
      { id: 2, intitule: 'Bilan radiographique',  statut: 'en_cours', date_debut: TODAY, date_fin: null },
    ],
  },
  {
    id: 2, nom: 'Youssef El Fassi', age: 45, groupe_sanguin: 'O+',
    telephone: '+212 6 98 76 54 32', email: 'y.elfassi@hotmail.com',
    allergies: null, antecedents: 'Diabète type 2 sous metformine. Contrôle glycémique requis.',
    consultations: [
      { id: 1, date: '10/02/2025', motif: 'Couronne dent 16', diagnostic: 'Fracture coronaire', notes: 'Empreinte prise, couronne provisoire posée' },
    ],
    traitements: [
      { id: 1, intitule: 'Couronne céramique dent 16', statut: 'en_cours', seances: 3, seance_actuelle: 2, date_debut: '10/02/2025', date_fin: null },
    ],
  },
  {
    id: 3, nom: 'Sara Chkouri', age: 33, groupe_sanguin: 'B+',
    telephone: '+212 6 55 44 33 22', email: 'sara.chkouri@gmail.com',
    allergies: null, antecedents: 'Grossesse 6 mois. Éviter radiographies. Anesthésie autorisée avec précautions.',
    consultations: [],
    traitements: [],
  },
  {
    id: 4, nom: 'Karim Mansouri', age: 52, groupe_sanguin: 'AB+',
    telephone: '+212 6 11 22 33 44', email: 'k.mansouri@yahoo.fr',
    allergies: 'Aspirine', antecedents: 'Hypertension traitée. Anticoagulants à surveiller.',
    consultations: [
      { id: 1, date: '05/03/2025', motif: 'Implant mandibulaire', diagnostic: 'Édentement partiel', notes: 'Pose implant réalisée. Cicatrisation en cours.' },
    ],
    traitements: [
      { id: 1, intitule: 'Implant mandibulaire', statut: 'en_cours', seances: 4, seance_actuelle: 2, date_debut: '05/03/2025', date_fin: null },
    ],
  },
  {
    id: 5, nom: 'Nadia Berrada', age: 38, groupe_sanguin: 'A-',
    telephone: '+212 6 77 88 99 00', email: 'nadia.berrada@gmail.com',
    allergies: null, antecedents: 'Aucun antécédent notable.',
    consultations: [
      { id: 1, date: '18/03/2025', motif: 'Blanchiment séance 1', diagnostic: 'Dyschromie extrinsèque', notes: 'Séance 1/3. Résultat satisfaisant.' },
    ],
    traitements: [
      { id: 1, intitule: 'Blanchiment professionnel', statut: 'en_cours', seances: 3, seance_actuelle: 2, date_debut: '18/03/2025', date_fin: null },
    ],
  },
];

// ── Mock ordonnances ──────────────────────────────────────────────────────────
const MOCK_ORDONNANCES = [
  { id: 1, numero: 'ORD-045', patient: 'Amina Tazi',       date: '15/01/2025', medicaments: 'Paracétamol 1g — 3x/jour 5 jours\nIbuprofène 400mg — après repas si douleur' },
  { id: 2, numero: 'ORD-044', patient: 'Karim Mansouri',   date: '05/03/2025', medicaments: 'Amoxicilline 1g — 2x/jour 7 jours\nParacétamol 1g — si douleur max 4/jour\nRinçage chlorhexidine 0.12% — 2x/jour' },
  { id: 3, numero: 'ORD-043', patient: 'Nadia Berrada',    date: '18/03/2025', medicaments: 'Gel fluoré — application quotidienne\nBain de bouche Eludril — 2x/jour 5 jours' },
];

// ── Mock stats ────────────────────────────────────────────────────────────────
const MOCK_STATS = {
  patients_mois: 142,
  ca_mois: 38700,
  taux_presence: 96,
  satisfaction: 4.8,
  actes: [
    { nom: 'Détartrage',  nb: 48, pct: 80 },
    { nom: 'Obturation',  nb: 36, pct: 60 },
    { nom: 'Couronne',    nb: 21, pct: 35 },
    { nom: 'Extraction',  nb: 15, pct: 25 },
    { nom: 'Implant',     nb: 11, pct: 18 },
    { nom: 'Blanchiment', nb: 8,  pct: 13 },
  ],
  recettes: [
    { mois: 'Jan', v: 28400 },
    { mois: 'Fév', v: 31200 },
    { mois: 'Mar', v: 38700 },
    { mois: 'Avr', v: 7000  },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
//  PLANNING REDUCER
// ═══════════════════════════════════════════════════════════════════════════════
export const planningReducer = (state = { liste: MOCK_PLANNING, date: TODAY, vue: 'jour' }, action) => {
  switch (action.type) {
    case PLANNING_SET_DATE: return { ...state, date: action.payload };
    case PLANNING_SET_VUE:  return { ...state, vue:  action.payload };
    default: return state;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DOSSIERS REDUCER
// ═══════════════════════════════════════════════════════════════════════════════
export const dossiersReducer = (state = { liste: MOCK_DOSSIERS, patientActif: null }, action) => {
  switch (action.type) {
    case DOSSIER_SET_PATIENT_ACTIF:
      return { ...state, patientActif: action.payload };

    case DOSSIER_ADD_CONSULTATION:
      return {
        ...state,
        liste: state.liste.map(d =>
          d.id === state.patientActif?.id
            ? { ...d, consultations: [action.payload, ...d.consultations] }
            : d
        ),
      };

    case DOSSIER_ADD_NOTE:
      return {
        ...state,
        liste: state.liste.map(d =>
          d.id === state.patientActif?.id
            ? { ...d, notes_dentiste: action.payload }
            : d
        ),
      };

    default:
      return state;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TRAITEMENTS REDUCER
// ═══════════════════════════════════════════════════════════════════════════════
export const traitementsReducer = (state = { actes_realises: [] }, action) => {
  switch (action.type) {
    case ACTE_ADD_SUCCESS:
      return { ...state, actes_realises: [action.payload, ...state.actes_realises] };

    case TRAITEMENT_UPDATE_SUCCESS:
      return state; // à brancher sur API

    default:
      return state;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ORDONNANCES REDUCER
// ═══════════════════════════════════════════════════════════════════════════════
export const ordonnancesReducer = (state = { liste: MOCK_ORDONNANCES }, action) => {
  switch (action.type) {
    case ORDONNANCE_ADD_SUCCESS:
      return { ...state, liste: [action.payload, ...state.liste] };
    default:
      return state;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  STATS REDUCER
// ═══════════════════════════════════════════════════════════════════════════════
export const statsReducer = (state = MOCK_STATS, action) => {
  return state;
};