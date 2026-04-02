// src/utils/database.js
// Base de données simulée - En production, ceci serait une vraie API

export const USERS_DB = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean@test.com',
    password: 'password123',
    phone: '+33 6 12 34 56 78',
    role: 'patient'
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie@test.com',
    password: 'marie2024',
    phone: '+33 6 98 76 54 32',
    role: 'patient'
  },
  {
    id: 3,
    name: 'Admin Cabinet',
    email: 'admin@cabinet.com',
    password: 'admin123',
    phone: '+33 1 23 45 67 89',
    role: 'admin'
  },
  // ── Compte dentiste ──────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Dr. Benali',
    email: 'dentiste@cabinet.com',
    password: 'dentiste123',
    phone: '+212 6 00 11 22 33',
    role: 'dentiste'
  },
  // ── Compte secrétaire ────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Fatima Alaoui',
    email: 'secretaire@cabinet.com',
    password: 'secretaire123',
    phone: '+212 6 00 44 55 66',
    role: 'secretaire'
  }
];

export const SERVICES_DB = [
  {
    id: 1,
    name: 'Consultation générale',
    description: 'Examen dentaire complet avec diagnostic',
    price: 50,
    duration: '30 min',
    category: 'Consultation',
    icon: '🦷',
    details: {
      included: [
        'Examen clinique complet',
        'Radiographie panoramique',
        'Diagnostic détaillé',
        'Plan de traitement personnalisé',
        'Conseils d\'hygiène bucco-dentaire'
      ],
      procedure: 'Examen visuel et palpation, radiographies si nécessaire, établissement du dossier médical',
      anesthesia: 'Non requise',
      recovery: 'Aucune',
      followUp: 'Contrôle tous les 6 mois recommandé'
    }
  },
  {
    id: 2,
    name: 'Détartrage',
    description: 'Nettoyage professionnel des dents',
    price: 70,
    duration: '45 min',
    category: 'Prévention',
    icon: '✨',
    details: {
      included: [
        'Élimination du tartre supra et sous-gingival',
        'Polissage des dents',
        'Application de fluor',
        'Conseils de brossage personnalisés'
      ],
      procedure: 'Détartrage ultrasonique et manuel, polissage avec pâte prophylactique',
      anesthesia: 'Locale si sensibilité',
      recovery: '24h (sensibilité possible)',
      followUp: 'Tous les 6 mois'
    }
  },
  {
    id: 3,
    name: 'Soins de carie',
    description: 'Traitement et obturation de caries',
    price: 120,
    duration: '1h',
    category: 'Soins',
    icon: '🔧',
    details: {
      included: [
        'Nettoyage de la cavité',
        'Obturation composite',
        'Ajustement de l\'occlusion',
        'Polissage final',
        'Contrôle radiographique'
      ],
      procedure: 'Anesthésie locale, élimination du tissu carié, obturation en composite',
      anesthesia: 'Locale systématique',
      recovery: '2-3h (fin anesthésie)',
      followUp: 'Contrôle à 1 mois'
    }
  },
  {
    id: 4,
    name: 'Blanchiment dentaire',
    description: 'Blanchiment professionnel des dents',
    price: 300,
    duration: '1h 30min',
    category: 'Esthétique',
    icon: '⭐',
    details: {
      included: [
        'Nettoyage préalable',
        'Protection des gencives',
        'Application gel blanchissant',
        'Activation par lampe LED',
        'Kit de maintenance à domicile'
      ],
      procedure: 'Application de gel à base de peroxyde, activation LED, 3 sessions de 20 minutes',
      anesthesia: 'Non requise',
      recovery: '48h (éviter aliments colorants)',
      followUp: 'Retouches possibles après 6 mois'
    }
  },
  {
    id: 5,
    name: 'Implant dentaire',
    description: 'Pose d\'implant en titane',
    price: 1500,
    duration: '2h',
    category: 'Chirurgie',
    icon: '🏥',
    details: {
      included: [
        'Scanner 3D pré-opératoire',
        'Implant en titane biomédical',
        'Pose chirurgicale guidée',
        'Pilier de cicatrisation',
        'Suivi post-opératoire (3 mois)',
        'Couronne provisoire'
      ],
      procedure: 'Anesthésie locale, incision gingivale, forage osseux, insertion implant, sutures',
      anesthesia: 'Locale + sédation possible',
      recovery: '7-10 jours',
      followUp: 'J+7, J+15, M+3 (pose couronne)'
    }
  },
  {
    id: 6,
    name: 'Orthodontie (consultation)',
    description: 'Consultation orthodontique initiale',
    price: 80,
    duration: '45 min',
    category: 'Orthodontie',
    icon: '😁',
    details: {
      included: [
        'Examen clinique complet',
        'Radiographies (panoramique + téléradiographie)',
        'Empreintes dentaires',
        'Analyse céphalométrique',
        'Devis détaillé du traitement'
      ],
      procedure: 'Examen, prise d\'empreintes, photos intra et extra-orales, analyse',
      anesthesia: 'Non requise',
      recovery: 'Aucune',
      followUp: 'Selon plan de traitement proposé'
    }
  }
];

// Fonction pour authentifier un utilisateur
export const authenticateUser = (email, password) => {
  const user = USERS_DB.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Fonction pour créer un nouvel utilisateur
export const createUser = (userData) => {
  const existingUser = USERS_DB.find(u => u.email === userData.email);
  if (existingUser) {
    return { error: 'Cet email est déjà utilisé' };
  }
  const newUser = {
    id: USERS_DB.length + 1,
    ...userData,
    role: 'patient'
  };
  USERS_DB.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Fonction pour obtenir un service par ID
export const getServiceById = (id) => {
  return SERVICES_DB.find(s => s.id === id);
};