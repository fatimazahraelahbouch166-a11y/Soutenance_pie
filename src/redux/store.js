// src/redux/store.js
import { createStore, combineReducers } from 'redux';

// ── Tes reducers existants ────────────────────────────────────────────────────
import authReducer    from './authReducer';
import cartReducer    from './cartReducer';
import invoiceReducer from './invoiceReducer';

// ── Reducers secrétaire ───────────────────────────────────────────────────────
import { patientsReducer, rdvReducer, facturesReducer } from './secretaireReducer';

// ── Reducers dentiste ─────────────────────────────────────────────────────────
import {
  planningReducer,
  dossiersReducer,
  traitementsReducer,
  ordonnancesReducer,
  statsReducer,
} from './dentisteReducer';

const rootReducer = combineReducers({
  // existants
  auth:     authReducer,
  cart:     cartReducer,
  invoices: invoiceReducer,

  // secrétaire
  patients: patientsReducer,
  rdv:      rdvReducer,
  factures: facturesReducer,

  // dentiste
  planning:    planningReducer,
  dossiers:    dossiersReducer,
  traitements: traitementsReducer,
  ordonnances: ordonnancesReducer,
  stats:       statsReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;