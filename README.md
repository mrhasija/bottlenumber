# BottleNumber

Diario personal de bebidas: vinos, whiskies, ginebras, rones, cervezas… con **tu** valoración y **el momento** en que las probaste.

Un solo código para **web (bottlenumber.com), iOS y Android**.

## Tecnología

- **Expo (React Native) + Expo Router**: app nativa y web desde el mismo código.
- **Supabase**: base de datos Postgres, cuentas (acceso con código por email) y almacenamiento de fotos.
- **EAS**: compilación y publicación en App Store / Google Play.

## Estructura

```
src/
  app/                  Pantallas (cada archivo es una ruta)
    login.tsx           Acceso con código por email
    (app)/index.tsx     Diario (historial filtrable por apartado)
    (app)/nueva.tsx     Alta libre de bebida + el momento
    (app)/eventos.tsx   Catas y eventos
    (app)/perfil.tsx    Exportación del diario y cierre de sesión
  config/brand.ts       Nombre, lema y colores (cambiar marca aquí)
  constants/categories.ts  Apartados y sus campos propios
  lib/                  Supabase, sesión y acceso a datos
  types/db.ts           Tipos de las tablas
supabase/migrations/    Esquema de base de datos y seguridad (RLS)
```

## Puesta en marcha

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. En Supabase → SQL Editor, ejecutar `supabase/migrations/20261113000000_init.sql`.
3. En Supabase → Authentication → Email templates, incluir `{{ .Token }}` en el email de acceso para que llegue el código de 6 dígitos.
4. Copiar `.env.example` a `.env.local` y rellenar URL y clave anon.
5. `npm install`
6. `npm run web` (navegador) o `npm start` y escanear el QR con Expo Go (móvil).

Comprobaciones: `npm run typecheck` y `npm run lint`.

## Estado del montaje (v1)

Hecho:
- Estructura del proyecto, marca centralizada y navegación.
- Esquema de datos: perfiles, entradas (bebida + momento), eventos, fotos; seguridad por usuario.
- Acceso, diario con filtros, alta libre por apartado, exportación JSON (UTF-8).

Siguiente:
- Fotos en las entradas (`expo-image-picker` ya instalado).
- Detalle y edición de entradas; alta de eventos y asociar bebidas.
- Exportación también en CSV y como fichero en móvil.
- Landing pública en bottlenumber.com con lista de espera.
- Configuración de EAS para las tiendas.

Fuera de la v1: escáner de etiquetas, importación desde Vivino, funciones sociales.
