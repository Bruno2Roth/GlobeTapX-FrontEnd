# Prompt para refactorizar GlobeTapX FrontEnd

Trabajá exclusivamente sobre el repositorio `GlobeTapX-FrontEnd`.

## Objetivo

Mantener y, si hace falta, completar la arquitectura:

```text
Component/Page
    ↓
Context o Hook cuando corresponda
    ↓
Service
    ↓
Cliente HTTP central
    ↓
Backend
```

Para autenticación:

```text
SessionContext
    ↓
backendApi.js
    ↓
api.js / Axios interceptor
    ↓
JWT
    ↓
Backend
```

## Estado actual que debés respetar

- `src/services/api.js` es el único cliente HTTP del backend.
- `src/services/api.js` contiene la instancia Axios, `baseURL`, el token, el header `Authorization` y el manejo central de `401`/`431`.
- `src/services/backendApi.js` concentra los endpoints del backend y usa `request()` de `api.js`.
- `src/context/SessionContext.jsx` es la única fuente React de sesión, usuario, foto, `userId` derivado e `isAuthenticated`.
- No existe `src/config.js`.
- `evento.js`, `languageService.js` y `countryDocumentationService.js` son reexports de compatibilidad, no clientes HTTP duplicados.
- Los `fetch` de `agenda.jsx` y `cambio.jsx` apuntan a servicios externos públicos y no deben migrarse al cliente Axios del backend.

## Reglas obligatorias

1. No modifiques el backend.
2. No agregues Axios, fetchers ni librerías HTTP nuevas.
3. No crees otro Context de autenticación.
4. No guardes `user`, `userId`, `fotoPerfil` ni JWT en componentes o páginas.
5. No agregues headers `Authorization` manuales fuera de `src/services/api.js`.
6. No envíes `userId` o `IDUsuario` como fuente de identidad si el backend puede resolverlos desde el JWT.
7. No elimines los reexports de compatibilidad sin verificar primero todos sus consumidores.
8. No cambies endpoints ni métodos HTTP sin verificar su uso actual.
9. Conservá los `404` específicos de documentación y los errores específicos de login.
10. Hacé cambios mínimos, fáciles de revisar y sin reescrituras generales.

## Cambios a evaluar e implementar solo si siguen siendo necesarios

### 1. Configuración del proxy

Revisá `vite.config.js`.

Actualmente el destino de desarrollo está hardcodeado:

```js
target: "http://A-PHZ2-CIDI-18:3000"
```

Si el proyecto necesita distintos entornos, mové únicamente el destino del proxy a una variable de entorno, por ejemplo `VITE_BACKEND_ORIGIN`.

Condiciones:

- mantené `API_BASE_URL = "/api"` en `src/services/api.js`;
- no construyas URLs del backend manualmente en componentes;
- agregá documentación o `.env.example` si corresponde;
- mantené un fallback seguro para desarrollo si el proyecto lo requiere;
- verificá login, `/auth/me` y al menos una request autenticada.

Si el host hardcodeado es intencional y único para este proyecto, no hagas este cambio.

### 2. Nombre canónico del catálogo de idiomas

Revisá el alias:

```js
getSupportedLanguages = getLanguageCatalog
```

Si no existe una dependencia externa que requiera el alias:

- actualizá `RegisterForm.jsx` para usar `getLanguageCatalog`;
- mantené temporalmente el alias y los reexports de compatibilidad;
- no cambies el endpoint `/idioma/catalogo`;
- verificá registro, perfil y selector de idioma.

### 3. Manejo de errores

Revisá únicamente las pantallas que hacen requests al backend y todavía convierten todos los errores en un mensaje genérico.

Usá `getUserFacingError()` cuando aporte valor para distinguir:

- `400`;
- `403`;
- `503`;
- errores de red.

Mantené sin cambios especiales:

- la lógica de credenciales incorrectas del login;
- el tratamiento de `401`/`431` del cliente y `SessionContext`;
- los estados `404` específicos de documentación;
- los errores de los servicios externos de agenda y cotización.

No hagas una abstracción de errores solo por eliminar unas líneas repetidas.

## Verificaciones obligatorias

Antes de modificar:

- confirmá que todas las requests backend usan `src/services/api.js`;
- confirmá que no existe otro `axios.create`;
- confirmá que no hay headers `Authorization` manuales;
- confirmá que `SessionContext` sigue siendo el único Context de sesión;
- revisá consumidores de los módulos de compatibilidad.

Después de modificar:

- ejecutá `npm.cmd run lint`;
- ejecutá `npm.cmd run build` si el entorno permite generar artefactos;
- verificá login exitoso;
- verificá login con credenciales inválidas;
- verificá restauración de sesión mediante `/auth/me`;
- verificá logout;
- verificá una respuesta `401` y que se limpie la sesión;
- verificá una request multipart de foto;
- verificá registro sin sesión previa;
- verificá catálogo de idiomas;
- verificá que las integraciones externas sigan funcionando.

## Entrega esperada

Informá:

1. qué archivos modificaste;
2. qué problema concreto resolviste en cada uno;
3. qué imports o consumidores actualizaste;
4. qué código eliminaste, si corresponde;
5. qué riesgos quedan;
6. qué verificaciones ejecutaste y sus resultados;
7. confirmación de que no modificaste el backend.

No hagas commits ni abras Pull Requests sin autorización explícita.
