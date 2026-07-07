// Traduce errores crudos de los providers de IA a mensajes que un usuario
// no técnico puede entender y accionar. Compartido por toda ruta que haga
// streamText/generateObject contra el proveedor BYOK del usuario.
export function humanizeError(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : String(error);

  if (/401|invalid.?api.?key|unauthorized/i.test(mensaje)) {
    return "Tu clave de IA no es válida o venció. Revisala en Ajustes.";
  }
  if (/429|rate.?limit/i.test(mensaje)) {
    return "Alcanzaste el límite de uso de tu proveedor de IA. Esperá un momento y probá de nuevo.";
  }
  if (/credit|balance|insufficient|quota/i.test(mensaje)) {
    return "Tu cuenta en ese proveedor de IA no tiene crédito disponible.";
  }
  return "Hubo un error al conectar con tu proveedor de IA. Probá de nuevo en unos segundos.";
}
