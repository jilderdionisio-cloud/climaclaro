# Bitácora de ClimaClaro

Esta bitácora resume trabajo verificable realizado por Codex. En el historial disponible hay cinco prompts de implementación anteriores a este cierre, no seis; se reproducen exactamente y no se inventa un sexto.

## 1. Inicio del proyecto

> Actúa como desarrollador y crea desde cero ClimaClaro, una aplicación web del clima con HTML, CSS y JavaScript, sin frameworks. Usa Git desde el inicio: trabaja en una carpeta nueva, ejecuta git init con rama main y configura .gitignore antes de programar. Verifica gh auth status y crea un repositorio público llamado climaclaro en mi cuenta de GitHub mediante GitHub CLI. Si ese nombre existe, elige uno disponible sin sobrescribirlo. Crea index.html, styles.css, app.js y README.md. Registra el primer commit y súbelo. No inventes mi identidad ni credenciales; si falta autenticación, indícame cómo iniciarla. Trabaja por las etapas de los siguientes prompts y usa commits en español. Al finalizar, muestra el enlace del repositorio y los archivos creados.

**Respuesta real:** se comprobó la sesión de GitHub CLI, se inicializó `main`, se creó `.gitignore`, el repositorio público y los cuatro archivos solicitados. **Primer intento:** correcto; commit `8aafd0a`. **Ajustes:** ninguno.

## 2. Interfaz completa

> Continúa en el mismo proyecto ClimaClaro y repositorio. Implementa una interfaz completa en español: encabezado, formulario para buscar una ciudad, área de coincidencias, estado de carga, tarjetas de temperatura, humedad y viento y pronóstico de tres días. Usa un diseño limpio con tonos azul y blanco, adaptable a celular y computadora. Incluye etiquetas para los campos, navegación con teclado, foco visible y avisos aria-live. Al inicio muestra instrucciones para buscar, sin presentar datos ficticios como reales. Usa HTML semántico y separa estructura, estilos y lógica. Comprueba que no haya desbordamientos ni errores de sintaxis. Registra y sube un commit en español con esta etapa y explica cómo ejecutar la interfaz localmente.

**Respuesta real:** se añadió interfaz accesible, estado inicial sin datos reales y vista adaptable. **Primer intento:** la edición agrupada falló por aplicar varias operaciones al mismo archivo en un parche. **Ajuste:** se dividió el cambio por archivo y se continuó; commit `f05d97a`.

## 3. Integración de Open-Meteo

> Integra Open-Meteo en ClimaClaro. Verifica primero [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs) y [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api). Busca ciudades mediante [https://geocoding-api.open-meteo.com/v1/search](https://geocoding-api.open-meteo.com/v1/search) usando name, count=5 y language=es. Muestra nombre, región y país para elegir la ubicación correcta. Con sus coordenadas consulta [https://api.open-meteo.com/v1/forecast](https://api.open-meteo.com/v1/forecast) con current=temperature_2m,relative_humidity_2m,wind_speed_10m y daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max, timezone=auto y forecast_days=3. Usa fetch y URLSearchParams, muestra las unidades y atribuye los datos a Open-Meteo. La modalidad pública académica no requiere clave; confirma sus condiciones. Comprueba una consulta real y evita datos simulados en la vista normal. Usa textContent para datos externos. Registra y sube el commit de integración.

**Respuesta real:** se verificó la documentación oficial, se implementaron las consultas y se comprobó una consulta real para Ciudad de México. **Primer intento:** la app solicitaba variables extra. **Ajuste:** se limitó la petición a los campos indicados y se usaron las unidades de respuesta; commit `e77f05b`.

## 4. Pruebas y correcciones

> Prueba ClimaClaro de principio a fin: buscar Lima y Mérida, elegir ciudad y comprobar temperatura, humedad, viento y tres fechas del pronóstico. Revisa la interfaz en tamaños de celular y computadora. Prueba resultados vacíos, desconexión, HTTP 429, fallo del servicio y datos iguales a cero; simula los errores difíciles de reproducir, identificándolos como simulaciones. Agrega pruebas útiles para las peticiones y sus errores. Si dispones de navegador, realiza una prueba visual; si no, informa esa limitación. Corrige los fallos y repite las comprobaciones afectadas. No declares aprobadas pruebas que no ejecutaste. Presenta una lista breve de resultados y pendientes. Registra y sube el commit de pruebas y correcciones.

**Respuesta real:** se probaron Lima, Mérida, un vacío real, móvil (375 px) y escritorio (1280 px). Se añadieron seis pruebas automatizadas. **Primer intento:** no existían pruebas ni mensajes específicos. **Ajuste:** se separó la capa de API y se cubrieron simulaciones de desconexión, HTTP 429, 5xx y cero; commit `459c8e7`.

## 5. Cierre documental

> Finaliza ClimaClaro. Completa README.md con objetivo, funciones, tecnologías, archivos, APIs y pasos exactos para ejecutar con python -m http.server 8000 y abrir [http://localhost:8000](http://localhost:8000); incluye la alternativa py para Windows. Declara qué tareas realizó Codex y deja pendiente mi trabajo sin IA si no está confirmado. Prepara docs/bitacora.md, de una a dos páginas, con estos seis prompts copiados exactamente, respuesta real, resultado del primer intento y ajustes efectuados; documenta un error real detectado, su solución y aprendizajes, sin inventar experiencias. Comprueba .gitignore, ausencia de secretos, ejecución, pruebas y estado de Git. Registra y sube el commit final. Entrega el enlace del repositorio, comandos de ejecución, resultados y pendientes. El proyecto debe quedar completo; informa cualquier bloqueo real.

**Respuesta real:** se completaron README y esta bitácora, y se verificará el estado final antes del commit. **Primer intento:** en curso al redactar esta entrada. **Ajuste pendiente:** ninguno conocido.

## Error real y aprendizaje

El único error de implementación detectado fue la validación del editor de parches al intentar modificar el mismo archivo con varias operaciones en una sola solicitud. Se resolvió separando las actualizaciones por archivo. El aprendizaje fue que los cambios atómicos, comprobados con sintaxis y pruebas después de cada etapa, reducen fallos de automatización sin atribuirlos erróneamente a la aplicación.
