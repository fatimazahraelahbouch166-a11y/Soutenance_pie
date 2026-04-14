import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { Camera, Upload, Loader2, CheckCircle2, Edit3, FileText } from 'lucide-react'
import { fmt } from '../../lib/helpers'

// Simulation OCR — résultats mock réalistes
const OCR_RESULTS = [
  { amount: 1250, date: '2025-03-28', vendor: 'Restaurant Al Fassia', category_id: 3, confidence: 94 },
  { amount: 4800, date: '2025-03-18', vendor: 'Royal Air Maroc',      category_id: 1, confidence: 97 },
  { amount: 890,  date: '2025-03-22', vendor: 'Marjane Casa',         category_id: 6, confidence: 88 },
  { amount: 3600, date: '2025-03-15', vendor: 'Hôtel Mercure Rabat',  category_id: 2, confidence: 96 },
]

const STATES = { idle: 'idle', uploading: 'uploading', processing: 'processing', done: 'done' }

export default function EquipeOCR() {
  const toast    = useToast()
  const navigate = useNavigate()
  const fileRef  = useRef()

  const [state, setState]       = useState(STATES.idle)
  const [preview, setPreview]   = useState(null)
  const [ocr, setOcr]           = useState(null)
  const [edited, setEdited]     = useState({})
  const setE = (k, v) => setEdited(p => ({ ...p, [k]: v }))

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return toast.error('Erreur', 'Veuillez sélectionner une image.')
    }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setState(STATES.uploading)
    setTimeout(() => setState(STATES.processing), 1000)
    setTimeout(() => {
      const result = OCR_RESULTS[Math.floor(Math.random() * OCR_RESULTS.length)]
      setOcr(result)
      setEdited({ amount: result.amount, date: result.date, vendor: result.vendor })
      setState(STATES.done)
      toast.success('Scan réussi', `Données extraites avec ${result.confidence}% de confiance.`)
    }, 2800)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleUse = () => {
    navigate('/app/expenses/new', {
      state: {
        prefill: {
          amount:      +edited.amount,
          expense_date: edited.date,
          title:       edited.vendor,
          category_id: ocr.category_id,
          description: `Extrait automatiquement depuis le reçu (${ocr.confidence}% de confiance)`,
        }
      }
    })
    toast.success('Formulaire pré-rempli', 'Vérifiez et soumettez votre dépense.')
  }

  const reset = () => { setState(STATES.idle); setPreview(null); setOcr(null); setEdited({}) }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Camera size={16} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Scanner un reçu</h3>
            <p className="text-xs text-gray-400">Extraction automatique des données</p>
          </div>
        </div>

        {state === STATES.idle && (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition group"
            onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            <div className="w-14 h-14 bg-gray-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition">
              <Upload size={22} className="text-gray-400 group-hover:text-indigo-500 transition" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Glissez votre reçu ici</p>
            <p className="text-xs text-gray-400 mb-3">ou cliquez pour sélectionner</p>
            <div className="flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">JPG</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">PNG</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">HEIC</span>
            </div>
          </div>
        )}

        {(state === STATES.uploading || state === STATES.processing) && (
          <div className="text-center py-10">
            {preview && (
              <img src={preview} alt="reçu" className="w-32 h-40 object-cover rounded-xl mx-auto mb-4 opacity-60" />
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              {state === STATES.uploading ? 'Téléchargement en cours…' : 'Analyse du reçu par OCR…'}
            </div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden">
              <div className={`h-full bg-indigo-500 rounded-full transition-all duration-700 ${
                state === STATES.uploading ? 'w-1/3' : 'w-4/5'
              }`} />
            </div>
            {state === STATES.processing && (
              <div className="mt-4 space-y-1">
                {['Détection du montant…','Lecture de la date…','Identification du vendeur…'].map((s, i) => (
                  <p key={s} className="text-xs text-gray-400" style={{ animationDelay: `${i * 0.4}s` }}>{s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {state === STATES.done && ocr && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={15} />
              <span>Extraction réussie — {ocr.confidence}% de confiance</span>
            </div>

            {preview && (
              <img src={preview} alt="reçu" className="w-full h-40 object-cover rounded-xl" />
            )}

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Edit3 size={11} /> Vérifier et corriger
              </p>
              {[
                { key: 'vendor',  label: 'Vendeur / Établissement', type: 'text' },
                { key: 'amount',  label: 'Montant (MAD)',            type: 'number' },
                { key: 'date',    label: 'Date',                     type: 'date' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="field-label">{f.label}</label>
                  <input type={f.type} value={edited[f.key] ?? ''} onChange={e => setE(f.key, e.target.value)}
                    className="input" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="btn-secondary flex-1">Nouveau scan</button>
              <button onClick={handleUse} className="btn-primary flex-1">
                <FileText size={14} /> Créer la dépense
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pour un meilleur résultat</p>
        <ul className="space-y-2">
          {[
            'Photo nette et bien éclairée',
            'Reçu à plat, sans pliures',
            'Montant et date bien visibles',
            'Évitez les ombres sur le document',
          ].map(tip => (
            <li key={tip} className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
