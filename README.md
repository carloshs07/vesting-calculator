# Stock Vesting Calculator

Una aplicación web interactiva para calcular y visualizar el progreso de vesting de acciones a lo largo del tiempo con una línea de tiempo dinámica.

## 🌟 Características

- **Cálculo Automático**: Calcula automáticamente el vesting de acciones basado en parámetros configurables
- **Línea de Tiempo Interactiva**: Navega a través del tiempo con un slider y visualiza el progreso
- **Visualización de Datos**: Gráfico combinado que muestra stocks totales, vested, grants y vests por mes
- **Configuración Flexible**: Ajusta el plazo, cantidad de stocks y meses de grant/vest
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar

## 🚀 Configuración por Defecto

- **Plazo**: 5 años
- **Meses de Vest**: Febrero y Agosto de cada año
- **Stocks por período**: 10 stocks cada Agosto
- **Mes de Grant**: Agosto de cada año

## 📊 Lógica de Vesting

1. **Grants**: Cada año en Agosto se otorgan nuevos stocks
2. **Vesting**: En Febrero y Agosto de cada año se hace vest de 1 acción de cada período acumulado
3. **Tracking**: El sistema mantiene un registro de todos los períodos y calcula el vesting correspondiente

## 🛠 Instalación y Uso

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd stock-vesting-calculator
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   ```

4. Abre tu navegador en `http://localhost:3000`

### Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Crea la versión de producción
- `npm test`: Ejecuta las pruebas
- `npm eject`: Expone la configuración de build (irreversible)

## 🏗 Estructura del Proyecto

```
src/
├── components/
│   ├── Timeline.js          # Componente de línea de tiempo interactiva
│   └── Timeline.css         # Estilos para el timeline
├── utils/
│   └── VestingCalculator.js # Lógica de cálculo de vesting
├── App.js                   # Componente principal de la aplicación
├── App.css                  # Estilos principales
├── index.js                 # Punto de entrada de React
└── index.css               # Estilos globales
```

## 📈 Componentes Principales

### VestingCalculator
Clase principal que maneja toda la lógica de cálculo:
- Calcula grants mensuales
- Procesa el vesting basado en el schedule
- Mantiene el estado de stocks por período
- Genera datos para visualización

### Timeline
Componente de visualización interactivo:
- Gráfico combinado (línea y barras)
- Slider para navegación temporal
- Controles de navegación
- Indicadores de eventos (grants/vests)
- Barra de progreso

### App
Componente principal que:
- Maneja el estado de configuración
- Coordina los componentes
- Proporciona la interfaz de usuario

## 🎨 Personalización

### Cambiar Configuración por Defecto

Modifica el estado inicial en `App.js`:

```javascript
const [config, setConfig] = useState({
  plazoAnios: 5,           // Cambiar plazo en años
  stocksIniciales: 10,     // Stocks iniciales (legacy)
  mesGranted: 8,           // Mes de grant (1-12)
  mesesVest: [2, 8],       // Meses de vest
  stocksPorPeriodo: 10     // Stocks por período
});
```

### Modificar Colores del Gráfico

En `Timeline.js`, ajusta los colores en `chartData.datasets`:

```javascript
borderColor: 'rgb(59, 130, 246)',        // Color de línea
backgroundColor: 'rgba(59, 130, 246, 0.1)', // Color de fondo
```

### Personalizar Estilos

- `App.css`: Estilos generales y layout
- `Timeline.css`: Estilos específicos del timeline
- `index.css`: Estilos globales y reset CSS

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Desktop, tablet, mobile
- **Resoluciones**: Optimizado para todas las resoluciones comunes

## 🔧 Dependencias Principales

- **React**: Framework principal
- **Chart.js + react-chartjs-2**: Visualización de gráficos
- **date-fns**: Manipulación de fechas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor:

1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable

## ✨ Roadmap

- [ ] Exportar datos a CSV/Excel
- [ ] Múltiples períodos de grant configurables
- [ ] Comparación de diferentes escenarios
- [ ] Notificaciones de vesting próximo
- [ ] Temas de color personalizables
- [ ] Modo oscuro
- [ ] Integración con APIs de stock market

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, puedes:

- Abrir un issue en GitHub
- Contactar a través del email del desarrollador
- Revisar la documentación y ejemplos incluidos

---

**Desarrollado con ❤️ usando React y Chart.js**# vesting-calculator
# vesting-calculator
