/**
 * Backend del buscador de confirmación de asistencia (RSVP).
 *
 * ─── CÓMO DESPLEGAR ─────────────────────────────────────────────────────────
 * 1. Abre la hoja de invitados → Extensiones → Apps Script.
 * 2. Reemplaza el contenido de Code.gs con este archivo completo.
 * 3. Ajusta SHEET_NAME abajo si tu pestaña no se llama "Hoja1".
 * 4. Implementar → Nueva implementación → Tipo: App web
 *      - Ejecutar como: Yo (tu cuenta)
 *      - Quién tiene acceso: Cualquier usuario
 * 5. Autoriza los permisos cuando se solicite.
 * 6. Copia la URL de implementación en VITE_GOOGLE_SCRIPT_URL (archivo .env).
 *
 * Si ya tenías un Code.gs previo para el formulario abierto, este lo
 * reemplaza por completo (ya no se agregan filas nuevas: se busca y se
 * actualiza el estado de las filas existentes).
 *
 * ─── COLUMNAS ESPERADAS (fila 1 = encabezados) ─────────────────────────────
 *   A: # (no se usa)          F: Acompañante (cupo asignado, solo lectura)
 *   B: Nombre                 G: Asistirá     ("Sí" / "No")
 *   C: Apellido paterno       H: (sin usar)
 *   D: Apellido materno       I: Niños        (cupo asignado, solo lectura)
 *   E: Familia
 * ────────────────────────────────────────────────────────────────────────────
 */

const SHEET_NAME = 'Hoja1'
const COL = {
  NOMBRE: 2,
  PATERNO: 3,
  MATERNO: 4,
  FAMILIA: 5,
  ACOMPANANTE: 6,
  ASISTIRA: 7,
  NINOS: 9,
}
const MIN_QUERY_WORDS = 2 // exige nombre completo o apellido de familia, no un solo apellido suelto
const MAX_FAMILIES = 6 // límite de seguridad para no exponer medio listado
// Palabras de enlace de apellidos compuestos (ej. "De la O"). No cuentan como
// palabra "real" al decidir si la búsqueda alcanza para tratarla como nombre
// completo — si no, un apellido compuesto de 3 palabras + otro apellido ya
// suma 4 tokens y se confunde con un nombre completo de otra familia.
const STOPWORDS = ['de', 'la', 'los', 'las', 'del', 'y']

function meaningfulWords(words) {
  return words.filter(w => STOPWORDS.indexOf(w) === -1)
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function tokenize(text) {
  return normalize(text).split(/\s+/).filter(Boolean)
}

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function doGet(e) {
  try {
    const queryWords = tokenize(e.parameter.q)
    const queryMeaningful = meaningfulWords(queryWords)
    if (queryMeaningful.length < MIN_QUERY_WORDS) {
      return jsonResponse({ status: 'ok', results: [] })
    }

    const sheet = getSheet()
    const values = sheet.getDataRange().getValues()
    const matchedFamilies = new Set()

    for (let i = 1; i < values.length; i++) {
      const row = values[i]
      const familiaText = normalize(row[COL.FAMILIA - 1])
      const personText = normalize(
        [row[COL.NOMBRE - 1], row[COL.MATERNO - 1], row[COL.PATERNO - 1]].join(' '),
      )

      // Coincide si TODAS las palabras buscadas están en el apellido de
      // familia (ej. "Estrada Mendoza") o en el nombre completo de esa
      // persona (ej. "Oscar Arturo Estrada Hernández"). Una sola palabra
      // suelta (un apellido común) ya no alcanza para traer resultados.
      const matchesFamilia = queryWords.every(w => familiaText.includes(w))
      // Requiere 3+ palabras REALES (sin contar "de"/"la"/etc.) para tratarlo
      // como nombre completo — así un apellido compuesto de varias palabras
      // (ej. "De la O") + otro apellido no se confunde con el nombre de
      // alguien de una familia distinta que casualmente tiene esos mismos
      // dos apellidos por matrimonio.
      const matchesPersona = queryMeaningful.length >= 3 && queryWords.every(w => personText.includes(w))

      if (matchesFamilia || matchesPersona) {
        matchedFamilies.add(row[COL.FAMILIA - 1])
        if (matchedFamilies.size > MAX_FAMILIES) break
      }
    }

    const results = []
    for (let i = 1; i < values.length; i++) {
      const row = values[i]
      if (matchedFamilies.has(row[COL.FAMILIA - 1])) {
        results.push({
          row: i + 1,
          nombre: row[COL.NOMBRE - 1],
          apellidoMaterno: row[COL.MATERNO - 1],
          apellidoPaterno: row[COL.PATERNO - 1],
          familia: row[COL.FAMILIA - 1],
          acompanante: row[COL.ACOMPANANTE - 1] || 0,
          ninos: row[COL.NINOS - 1] || 0,
          asistira: row[COL.ASISTIRA - 1] || '',
        })
      }
    }

    return jsonResponse({ status: 'ok', results })
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) })
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet()
    const lastRow = sheet.getLastRow()
    const updates = Array.isArray(data.updates) ? data.updates : []

    updates.forEach(u => {
      const rowNum = Number(u.row)
      if (!rowNum || rowNum < 2 || rowNum > lastRow) return
      sheet.getRange(rowNum, COL.ASISTIRA).setValue(u.attending ? 'Sí' : 'No')
    })

    return jsonResponse({ status: 'ok' })
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) })
  }
}
