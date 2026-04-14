import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { calcMileage, KM_RATES } from '../../hooks/useEquipeData'
import { fmt } from '../../lib/helpers'
import { MapPin, Car, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Tétouan','Kénitra']

export default function EquipeMileage() {
  const toast    = useToast()
  const navigate = useNavigate()

  const [from, setFrom]       = useState('')
  const [to, setTo]           = useState('')
  const [vehicle, setVehicle] = useState('voiture')
  const [roundTrip, setRoundTrip] = useState(false)
  const [result, setResult]   = useState(null)
  const [calculated, setCalculated] = useState(false)

  const handleCalc = () => {
    if (!from || !to) return toast.error('Erreur', 'Sélectionnez les deux villes.')
    if (from === to)  return toast.error('Erreur', 'Les villes doivent être différentes.')

    const res = calcMileage(from, to, vehicle)
    if (!res) return toast.warning('Distance inconnue', 'Cette route n\'est pas dans notre base. Saisissez la distance manuellement.')

    const multiplier = roundTrip ? 2 : 1
    setResult({
      ...res,
      distance: res.distance * multiplier,
      amount:   Math.round(res.amount * multiplier * 100) / 100,
      roundTrip,
    })
    setCalculated(true)
  }

  // const handleUse = () => {
  //   toast.success('Formulaire pré-rempli', 'Créez votre dépense avec les valeurs calculées.')
  //   navigate('/app/expenses/new', {
  //     state: {
  //       prefill: {
  //         category_id: 1,
  //         title:       `Trajet ${from} → ${to}${roundTrip ? ' (aller-retour)' : ''}`,
  //         amount:      result?.amount,
  //         description: `${result?.distance} km · ${KM_RATES[vehicle]?.rate} MAD/km · ${KM_RATES[vehicle]?.label}`,
  //       }
  //     }
  //   })
  // }
const handleUse = () => {
  if (!result) {
    toast.error("Erreur", "Aucun calcul disponible")
    return
  }

  const expense = {
    id: Date.now(),
    category_id: 1,
    title: `Trajet ${from} → ${to}${roundTrip ? ' (aller-retour)' : ''}`,
    amount: result.amount,
    type: 'kilometric',
    description: `${result.distance} km · ${KM_RATES[vehicle]?.rate} MAD/km`,
    date: new Date().toISOString().slice(0, 10),
  }

  const old = JSON.parse(localStorage.getItem('expenses') || '[]')
  localStorage.setItem('expenses', JSON.stringify([expense, ...old]))

  toast.success('Dépense créée localement')

  navigate(`/app/expenses/${expense.id}`)
}
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Calculator size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Calculateur kilométrique</h3>
            <p className="text-xs text-gray-400">Barème marocain</p>
          </div>
        </div>

        {/* Villes */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="field-label flex items-center gap-1"><MapPin size={11} className="text-green-500" /> Ville de départ</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="input">
              <option value="">Sélectionner…</option>
              {CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="mx-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowRight size={12} className="text-gray-400" />
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="field-label flex items-center gap-1"><MapPin size={11} className="text-red-500" /> Ville de destination</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="input">
              <option value="">Sélectionner…</option>
              {CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Véhicule */}
        <div className="flex flex-col gap-1">
          <label className="field-label flex items-center gap-1"><Car size={11} /> Type de véhicule</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(KM_RATES).map(([k, v]) => (
              <button key={k} onClick={() => setVehicle(k)} type="button"
                className={`p-3 rounded-xl border text-left transition ${
                  vehicle === k ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <p className={`text-xs font-medium ${vehicle === k ? 'text-indigo-700' : 'text-gray-700'}`}>{v.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{v.rate} MAD/km</p>
              </button>
            ))}
          </div>
        </div>

        {/* Aller-retour */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div className={`w-10 h-6 rounded-full transition-colors ${roundTrip ? 'bg-indigo-600' : 'bg-gray-200'}`}
            onClick={() => setRoundTrip(v => !v)}>
            <div className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform ${roundTrip ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-sm text-gray-700">Aller-retour</span>
        </label>

        <button onClick={handleCalc} className="btn-primary w-full">
          <Calculator size={14} /> Calculer le remboursement
        </button>
      </div>

      {/* Résultat */}
      {calculated && result && (
        <div className="card p-5 border-indigo-200 bg-indigo-50">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-indigo-600" />
            <h4 className="text-sm font-semibold text-indigo-800">Résultat du calcul</h4>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-lg font-bold text-gray-900">{result.distance} km</p>
              {result.roundTrip && <p className="text-[10px] text-gray-400">aller-retour</p>}
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Taux</p>
              <p className="text-lg font-bold text-gray-900">{result.rate}</p>
              <p className="text-[10px] text-gray-400">MAD/km</p>
            </div>
            <div className="bg-indigo-600 rounded-xl p-3 text-center">
              <p className="text-xs text-indigo-200 mb-1">Remboursement</p>
              <p className="text-lg font-bold text-white tabular-nums">{fmt(result.amount)}</p>
            </div>
          </div>
          <button onClick={handleUse} className="btn-primary w-full">
            Utiliser ce montant → Créer la dépense
          </button>
        </div>
      )}

      {/* Tableau barèmes */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Barème kilométrique (indicatif)</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 text-gray-400 font-medium">Véhicule</th>
              <th className="text-right pb-2 text-gray-400 font-medium">Taux / km</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Object.entries(KM_RATES).map(([k, v]) => (
              <tr key={k}>
                <td className="py-2 text-gray-600">{v.label}</td>
                <td className="py-2 text-right font-medium text-gray-800">{v.rate} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
