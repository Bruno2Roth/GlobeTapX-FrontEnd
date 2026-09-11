# Refactorización del frontend

## Resumen

- `src/services/api.js` es el único cliente HTTP del backend. Usa Axios, agrega el Bearer token, normaliza errores de red y, ante `401`/`431`, elimina el token y emite `globetapx:session-expired`.
- `src/services/backendApi.js` concentra los endpoints de autenticación, usuarios, fotos, países, catálogos, agenda, clima, eventos, traducciones y documentación.
- `src/context/SessionContext.jsx` es la única fuente de verdad React para `user`, `photo`, `userId`, `loading` e `isAuthenticated`. Como credencial de sesión, solo se persiste el token.
- `config.js`, `authSession.js`, `userProfileService.js` y `userProfileCache.js` dejaron de existir. `evento.js`, `languageService.js` y `countryDocumentationService.js` conservan únicamente reexportaciones de compatibilidad.
- Las pantallas y componentes migrados consumen `useSession()`. Las operaciones de agenda e idioma no envían `IDUsuario` ni `usuarioId`; los caches restantes contienen solo contenido de pantalla y no autorizan operaciones.
- `/horario` quedó protegido junto con las demás rutas privadas.

## Archivos principales

- `src/services/api.js`
- `src/services/backendApi.js`
- `src/context/SessionContext.jsx`
- `src/App.jsx` y `src/main.jsx`
- `src/Pages/agenda.jsx`, `clima.jsx`, `detalleEvento.jsx`, `documentacion.jsx`, `eventos.jsx`, `home.jsx`, `horario.jsx`, `numEmergencia.jsx`, `perfil.jsx`, `reglas.jsx` y `vidaDiaria.jsx`
- `src/Componentes/Header/Header.jsx`, `TopBar/TopBar.jsx`, `ProfileCard/ProfileCard.jsx`, `LanguageSelector/LanguageSelector.jsx` y `RegisterForm/RegisterForm.jsx`

## Compatibilidad pendiente

El backend actual todavía requiere el ID del usuario en la ruta de actualización de perfil (`PUT /api/usuario/:id`) y en las rutas de foto (`/api/storage/profile/:id`). El contexto obtiene esos IDs exclusivamente de `/auth/me`, y el backend valida que coincidan con el JWT o con una autorización administrativa. No se envían como campos de identidad en los bodies.

También se conserva la función explícita `getAgendaUsuarioById` para consumidores administrativos/self autorizados por el backend; ninguna pantalla normal la utiliza. Las funciones antiguas de idioma y eventos se mantienen como reexportaciones y los argumentos de identidad heredados no se usan para construir la solicitud.

## Verificaciones

Verificaciones estáticas ejecutadas:

- `node --check` sobre los módulos JavaScript centrales: correcto.
- `git diff --check`: correcto.
- Auditoría de imports: sin consumidores de `src/config.js`, `authSession` ni los servicios/cache de perfil eliminados.
- Auditoría HTTP: las únicas llamadas `fetch` restantes apuntan a servicios públicos externos; el backend pasa por Axios en `src/services/api.js`.
- Auditoría de identidad: no quedan lecturas de `localStorage` de `user`, `userId` o `fotoPerfil`; la limpieza de esas claves está aislada en la migración de `SessionContext` y el token es la única credencial persistida.
- Auditoría de bodies: no quedan `IDUsuario`/`usuarioId` en las operaciones de agenda o idioma; el update de perfil filtra campos de identidad, permisos, idioma y foto.

`npm run lint` y `npm run build` fueron intentados; el PowerShell del entorno bloquea `npm.ps1`. Sus equivalentes `npm.cmd run lint` y `npm.cmd run build` sí llegaron al script, pero no pudieron completarse porque el checkout no tenía dependencias instaladas (`eslint` y `vite` no estaban disponibles). `npm ci` tampoco pudo instalar dependencias en este entorno: el registro devolvió errores de acceso (`EACCES`) y npm terminó con `Exit handler never called`. No se modificaron el backend ni `ATIENDE_FRONTEND`.
