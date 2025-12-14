# Bienestar — Registro de bienestar personal

Aplicación Angular simple para registrar y visualizar estadísticas diarias de: dolor, libido, sueño y estado de ánimo. Los datos se guardan en `localStorage` del navegador.

Características principales:
- Categorías y nivel de intensidad por métrica
- Vista de calendario para seleccionar fechas
- Registro con comentario por día
- Página de estadísticas con resúmenes
- Responsive y diseño limpio

Requisitos:
- Node.js (16+ recomendado)
- npm

Instalación y ejecución:

```powershell
cd c:\Proyectos\Bienestar
npm install
npx ng serve --open
```

Nota: el proyecto incluye dependencias de Angular en `package.json`. Si prefieres instalar Angular CLI globalmente:

```powershell
npm i -g @angular/cli
npm install
ng serve
```

Uso rápido:
- Ir a "Calendario" y seleccionar una fecha.
- Completar categorías, intensidad y comentario.
- Guardar. Los datos estarán en `localStorage`.
- Ver tendencias en "Estadísticas".

Si quieres, puedo:
- agregar export/import de datos (JSON)
- mejorar el calendario con selección visual por mes
- agregar gráficos con librería (Chart.js)
