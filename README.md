# FlagMaster 🌎

Juego educativo en React Native, Expo SDK 57 y JavaScript. Navegación con Expo Router. No requiere cuenta, backend ni credenciales.

## Ejecutar

```sh
npm install
npm start
```

Abrir el QR con una versión de Expo Go compatible con SDK 57 o con un development build. `npm run web` permite abrir la versión web. La primera carga necesita Internet, al igual que las imágenes de banderas.

## Reglas

- 10 banderas por partida; 15 segundos por bandera.
- Acierto: 10 puntos más los segundos restantes. Error: −1 punto, con nuevos intentos y puntajes negativos permitidos.
- Pista: revela una posición nueva y resta 2 segundos. Conserva espacios y puntuación.
- Al vencer el tiempo se revela el país y se avanza sin restar puntos.
- Se guarda el mejor puntaje de cada nombre en AsyncStorage. Los nombres se agrupan sin distinguir mayúsculas ni acentos.
- La API devuelve nombres en inglés: las respuestas y las pistas usan esos mismos nombres, con normalización de acentos y espacios.
- La precisión mide aciertos sobre respuestas enviadas. Los tiempos agotados se muestran por separado.
- Se puede finalizar antes de las 10 banderas y guardar el puntaje acumulado.

## Organización

`src/app/`: rutas y provider raíz. `src/context/GameContext.js`: estados, reglas, reloj y persistencia. `src/components/`: UI que consume `useGame()` directamente. `src/screens/`: composición de pantallas. `src/services/`: petición y validación de API. `src/utils/`: normalización y selección aleatoria. `src/constants/`: tema visual.

El reloj usa una fecha límite, un solo intervalo y limpieza al desmontar. La referencia del estado bloquea respuestas simultáneas; la misma respuesta incorrecta no vuelve a descontar hasta que se envíe otra respuesta o cambie la bandera.

## Verificación

```sh
npm run lint
npm run typecheck
npx expo install --check
npx expo-doctor
npx expo export --platform web
node --test tests/*.test.mjs
```

El chequeo TypeScript se ejecuta sobre archivos JavaScript; no hay pantallas ni lógica escritas en TypeScript.

Pruebas manuales en teléfono:

1. Ingresar un nombre; comprobar carga, navegación y bandera sin deformación.
2. Enviar una respuesta incorrecta: comprobar −1; pulsar repetidamente: no repetir el descuento.
3. Pedir varias pistas: posiciones distintas y −2 segundos inmediatos.
4. Dejar vencer el reloj: revelar el nombre, avanzar después de una pausa, reiniciar en 15.
5. Responder el nombre revelado cuando vuelva a aparecer: comprobar +10 y bonus; probar mayúsculas y acentos.
6. Completar 10 banderas: resultados automáticos, aciertos, errores, precisión y mejor marca.
7. Volver a jugar con el mismo nombre: conservar solo el mejor puntaje. Probar otro jugador y revisar orden y medallas.
8. Cerrar y volver a abrir: comprobar persistencia del ranking.
9. Probar sin conexión, reintentar, teclado abierto, pantalla pequeña y retorno desde segundo plano.

API: https://countriesnow.space/api/v0.1/countries/flag/images. Se verificó la estructura `{ error, msg, data: [{ name, flag, iso2, iso3 }] }` con 222 países. Las banderas SVG se muestran mediante `expo-image`.

Validación en este entorno: lint, chequeo de JavaScript, pruebas de utilidades y exportaciones web y Android correctas. `expo install --check` confirma versiones compatibles con SDK 57. Expo Doctor pasa 19/21 controles; no pudo completar la validación remota del esquema por un certificado autofirmado de la red ni consultar React Native Directory por una respuesta inesperada del servicio. No se realizó una prueba interactiva en un dispositivo físico; usar la lista manual anterior para verificar teclado, imágenes, partida completa y persistencia después de cerrar la app.
"# TP13AdivinandoLasBanderas" 
