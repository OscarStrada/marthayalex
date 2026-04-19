export interface RSVPPayload {
  name: string
  attending: boolean
  timestamp: string
}

export type RSVPResult = 'success' | 'error'

/**
 * Sends RSVP data to a Google Apps Script Web App endpoint.
 *
 * ─── SETUP GOOGLE APPS SCRIPT ───────────────────────────────────────────────
 * 1. Ve a script.google.com → Nuevo proyecto
 * 2. Pega el siguiente código en Code.gs, reemplaza SHEET_ID con el ID de tu
 *    Google Spreadsheet (lo encuentras en la URL: /d/SHEET_ID/edit)
 * 3. Haz clic en Implementar → Nueva implementación → App web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos cuando se solicite
 * 5. Copia la URL de implementación y ponla en VITE_GOOGLE_SCRIPT_URL en .env
 *
 * ─── Code.gs ────────────────────────────────────────────────────────────────
 *
 * const SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI'
 * const SHEET_NAME = 'RSVPs'
 *
 * function doPost(e) {
 *   try {
 *     const data = JSON.parse(e.postData.contents)
 *     const ss = SpreadsheetApp.openById(SHEET_ID)
 *     let sheet = ss.getSheetByName(SHEET_NAME)
 *     if (!sheet) {
 *       sheet = ss.insertSheet(SHEET_NAME)
 *       sheet.appendRow(['Timestamp', 'Nombre', 'Asistirá'])
 *     }
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow(['Timestamp', 'Nombre', 'Asistirá'])
 *     }
 *     sheet.appendRow([
 *       data.timestamp,
 *       data.name,
 *       data.attending ? 'Sí' : 'No'
 *     ])
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ status: 'ok' }))
 *       .setMimeType(ContentService.MimeType.JSON)
 *   } catch (err) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
 *       .setMimeType(ContentService.MimeType.JSON)
 *   }
 * }
 *
 * function doGet() {
 *   return ContentService
 *     .createTextOutput('Wedding RSVP endpoint is live.')
 * }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NOTA IMPORTANTE SOBRE CORS:
 * Google Apps Script NO soporta preflight CORS (OPTIONS) desde el navegador.
 * Se debe usar mode: 'no-cors' en el fetch. La respuesta será opaque (ilegible),
 * por lo que el éxito se infiere de la ausencia de error de red.
 */

export async function submitRSVP(payload: RSVPPayload): Promise<RSVPResult> {
  const url = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined

  if (!url || url.includes('YOUR_SCRIPT_ID')) {
    console.warn('[sheetsService] VITE_GOOGLE_SCRIPT_URL no está configurado. Simulating success.')
    await new Promise(resolve => setTimeout(resolve, 1200))
    return 'success'
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return 'success'
  } catch {
    return 'error'
  }
}
