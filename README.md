# Gestos de Gastos

Gestor de gastos mensual: registrá ingresos y gastos, filtrá por mes
y mirá en qué categorías se va tu plata.

**Demo:** https://TU-URL.vercel.app

## Funcionalidades

- CRUD completo de transacciones (ingresos y gastos)
- Categorías como entidad relacionada
- Balance general y balance filtrado por mes
- Gasto por categoría con porcentajes
- Diseño Mobile First
- Uso sin registro (sesión anónima) y cuenta con email, sin perder los datos cargados

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript estricto
- **Estilos:** Tailwind CSS + Sass (CSS Modules)
- **Estado global:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Deploy:** Vercel

## Arquitectura

    src/
    ├── app/          # Rutas y páginas
    ├── components/   # UI (solo presentación)
    ├── hooks/        # Lógica reutilizable
    ├── lib/          # Cliente de Supabase
    ├── services/     # Acceso a datos
    ├── store/        # Estado global
    ├── types/        # Tipos compartidos
    └── utils/        # Funciones puras (cálculos, formato)

El esquema de base de datos y las políticas RLS están en `supabase/schema.sql`.

## Correr el proyecto localmente

1. Cloná el repo e instalá dependencias: `npm install`
2. Creá un proyecto en Supabase y ejecutá los archivos de supabase/migrations en orden.
3. Activá los inicios de sesión anónimos en Authentication
4. Copiá `.env.example` a `.env.local` y completá tus claves
5. `npm run dev`