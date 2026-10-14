# ClimaClaro

ClimaClaro es una aplicación web estática, en español, para buscar una ciudad y consultar sus condiciones actuales y un pronóstico de tres días mediante datos reales de Open-Meteo.

## Objetivo

Ofrecer una consulta meteorológica clara y accesible, sin frameworks ni claves de API, para uso académico y no comercial.

## Funciones

- Busca hasta cinco coincidencias por ciudad y muestra nombre, región y país.
- Carga automáticamente Mérida, Yucatán, México al abrir la aplicación.
- Consulta temperatura, condición, humedad, sensación térmica, viento y probabilidad de lluvia actuales con las unidades entregadas por la API.
- Presenta tres días de pronóstico: icono de condición, temperatura máxima, mínima y probabilidad de precipitación.
- Permite solicitar la ubicación actual del navegador.
- Adapta suavemente el fondo y los iconos con la condición meteorológica y el día o la noche reales.
- Incluye esqueletos de carga, reintento, resultados vacíos y errores de red, tiempo de espera, límite de solicitudes y servicio no disponible.
- Mantiene foco visible, etiquetas de formulario, navegación con teclado y avisos `aria-live`.

## Tecnologías

- HTML5 semántico.
- CSS3 adaptable a móvil y escritorio.
- JavaScript nativo con módulos ES, `fetch` y `URLSearchParams`.
- Node.js integrado únicamente para ejecutar pruebas automatizadas.

## Archivos

| Archivo o carpeta | Propósito |
| --- | --- |
| `index.html` | Estructura semántica y carga de la aplicación. |
| `styles.css` | Diseño responsivo en tonos azul y blanco. |
| `app.js` | Interacciones, accesibilidad y renderizado de la vista. |
| `weather-api.js` | Peticiones a Open-Meteo y traducción de errores HTTP/red. |
| `weather-format.js` | Formato seguro de métricas, incluidos valores cero. |
| `tests/weather-api.test.mjs` | Pruebas de parámetros y escenarios de error simulados. |
| `docs/bitacora.md` | Registro de las etapas realizadas por Codex. |

## APIs y atribución

- [Geocoding API de Open-Meteo](https://open-meteo.com/en/docs/geocoding-api): busca con `name`, `count=5` y `language=es`.
- [Forecast API de Open-Meteo](https://open-meteo.com/en/docs): consulta condiciones actuales y tres días de pronóstico con `timezone=auto`.

Los datos meteorológicos se atribuyen visiblemente a Open-Meteo. La capa pública no requiere clave para uso no comercial, académico, evaluación o prototipado; respeta los límites y condiciones vigentes del proveedor.

## Ejecutar localmente

Desde la carpeta del proyecto, inicia un servidor estático:

```powershell
python -m http.server 8000
```

En Windows, si `python` no está disponible, usa:

```powershell
py -m http.server 8000
```

Después abre [http://localhost:8000](http://localhost:8000) en el navegador. Presiona `Ctrl+C` en la terminal para detener el servidor.

## Pruebas

```powershell
npm test
```

Las pruebas automatizadas validan los parámetros de API y simulan desconexión, HTTP 429, error 5xx y valores iguales a cero. Para que la interfaz consulte datos reales, se requiere conexión a internet.

## Trabajo realizado por Codex

- Creó el proyecto, configuró Git, creó y subió el repositorio público.
- Implementó la interfaz, accesibilidad, integración de Open-Meteo y manejo de errores.
- Ejecutó búsquedas reales de Lima y Mérida, pruebas automatizadas y revisión visual móvil/escritorio.
- Redactó la documentación y registró los commits del repositorio.

## Pendiente de la persona usuaria

No hay trabajo manual confirmado como pendiente. Si se desea publicar la app en un hosting, configurar un dominio o ampliar el producto, esas decisiones y credenciales deben ser proporcionadas por la persona usuaria.
