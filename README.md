# Aplicación de Reseñas de Libros

Esta aplicación permite a los usuarios navegar, buscar y reseñar libros. Los usuarios pueden registrarse, iniciar sesión, ver detalles de libros, dejar reseñas y ver las reseñas de otros usuarios.

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Ant Design (biblioteca de componentes UI)
- React Router (para navegación)
- Axios (para peticiones HTTP)


## Características

- **Exploración de libros:** Navegar y buscar libros por título, autor o categoría
- **Filtrado por categorías:** Filtrar libros por categoría
- **Detalles de libros:** Ver información detallada de cada libro
- **Sistema de reseñas:** Leer y escribir reseñas con calificación de 1 a 5 estrellas
- **Autenticación de usuarios:** Registro, inicio de sesión y cierre de sesión
- **Perfil de usuario:** Ver y editar información del perfil
- **Gestión de reseñas propias:** Editar y eliminar reseñas propias
- **Diseño responsive:** Compatible con dispositivos móviles y de escritorio

## Estructura del proyecto

```
src/
  ├── assets/                 # Imágenes, iconos, etc.
  ├── components/             # Componentes reutilizables
  │   ├── layout/            # Componentes de layout (Header, Footer)
  │   ├── books/             # Componentes relacionados con libros
  │   └── reviews/           # Componentes relacionados con reseñas
  ├── context/                # Contextos de React (AuthContext)
  ├── hooks/                  # Custom hooks
  ├── pages/                  # Páginas/rutas de la aplicación
  │   ├── Home/              # Página de inicio
  │   ├── BookDetails/       # Página de detalles de libro
  │   ├── Login/             # Página de inicio de sesión
  │   ├── Register/          # Página de registro
  │   ├── Profile/           # Página de perfil de usuario
  │   └── NotFound/          # Página 404
  ├── services/               # Servicios API
  ├── types/                  # Definiciones de TypeScript
  ├── App.tsx                 # Componente principal
  └── index.tsx               # Punto de entrada
```

## Instalación y ejecución

### Requisitos previos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos para instalar y ejecutar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jonatanmedina12/Project-React-Book-reviews.git
   cd book-reviews-app
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm start
   # o
   yarn start
   ```

4. Compilar para producción:
   ```bash
   npm run build
   # o
   yarn build
   ```

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
REACT_APP_API_URL=http://localhost:8080/api
```
