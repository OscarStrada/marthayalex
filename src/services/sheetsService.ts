export interface Guest {
  row: number
  nombre: string
  apellidoMaterno: string
  apellidoPaterno: string
  familia: string
  acompanante: number
  ninos: number
  asistira: string
}

export type RSVPResult = 'success' | 'error'

/**
 * Backend: Google Apps Script Web App vinculado a la hoja de invitados.
 * Busca por nombre/apellido/familia y actualiza el estado de asistencia de
 * las filas existentes (no crea filas nuevas).
 *
 * El código completo para desplegar en Extensiones → Apps Script está en
 * google-apps-script/Code.gs, con las instrucciones de despliegue.
 * La URL de implementación va en VITE_GOOGLE_SCRIPT_URL (archivo .env).
 *
 * NOTA SOBRE CORS: Apps Script no soporta preflight CORS (OPTIONS) desde el
 * navegador. La búsqueda (GET simple, sin encabezados personalizados) sí es
 * legible normalmente. La actualización (POST) usa mode: 'no-cors', por lo
 * que la respuesta es opaca y el éxito se infiere de la ausencia de error de
 * red — igual que en la implementación anterior de este archivo.
 */

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined
const isConfigured = !!SCRIPT_URL && !SCRIPT_URL.includes('YOUR_SCRIPT_ID')

// Datos de prueba usados SOLO mientras VITE_GOOGLE_SCRIPT_URL no está
// configurado, para poder probar el buscador end-to-end sin depender del
// despliegue de Apps Script. Las confirmaciones se guardan en memoria (se
// pierden al recargar la página) hasta que se conecte la hoja real.
const MOCK_GUESTS: Guest[] = [
  { row: 2, nombre: 'Elsa', apellidoMaterno: 'Rico', apellidoPaterno: 'López', familia: 'Mendoza Rico', acompanante: 0, ninos: 0, asistira: '' },
  { row: 3, nombre: 'Nadia', apellidoMaterno: 'Mendoza', apellidoPaterno: 'Rico', familia: 'Estrada Mendoza', acompanante: 0, ninos: 0, asistira: '' },
  { row: 4, nombre: 'Edgardo', apellidoMaterno: 'Estrada', apellidoPaterno: 'Cortéz', familia: 'Estrada Mendoza', acompanante: 0, ninos: 0, asistira: '' },
  { row: 5, nombre: 'Ángel Miguel', apellidoMaterno: 'Estrada', apellidoPaterno: 'Rico', familia: 'Estrada Mendoza', acompanante: 0, ninos: 1, asistira: '' },
  { row: 6, nombre: 'Eduardo', apellidoMaterno: 'Palmerin', apellidoPaterno: 'Ruiz', familia: 'Palmerin Ruiz', acompanante: 5, ninos: 0, asistira: '' },
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export async function searchGuests(query: string): Promise<Guest[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  if (!isConfigured) {
    console.warn('[sheetsService] VITE_GOOGLE_SCRIPT_URL no está configurado. Usando datos de prueba.')
    await new Promise(resolve => setTimeout(resolve, 400))
    const q = normalize(trimmed)
    const families = new Set(
      MOCK_GUESTS.filter(g =>
        [g.nombre, g.apellidoMaterno, g.apellidoPaterno, g.familia].some(v => normalize(v).includes(q)),
      ).map(g => g.familia),
    )
    return MOCK_GUESTS.filter(g => families.has(g.familia)).map(g => ({ ...g }))
  }

  const res = await fetch(`${SCRIPT_URL}?q=${encodeURIComponent(trimmed)}`)
  const data = await res.json()
  return data.results ?? []
}

export async function updateRSVPStatus(
  updates: { row: number; attending: boolean }[],
): Promise<RSVPResult> {
  if (updates.length === 0) return 'success'

  if (!isConfigured) {
    console.warn('[sheetsService] VITE_GOOGLE_SCRIPT_URL no está configurado. Guardando en memoria.')
    await new Promise(resolve => setTimeout(resolve, 800))
    updates.forEach(({ row, attending }) => {
      const guest = MOCK_GUESTS.find(g => g.row === row)
      if (guest) guest.asistira = attending ? 'Sí' : 'No'
    })
    return 'success'
  }

  try {
    await fetch(SCRIPT_URL as string, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    })
    return 'success'
  } catch {
    return 'error'
  }
}
