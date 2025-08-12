# SpriteTools - Plataforma Avanzada de Pruebas de Sprites

**SpriteTools** (también conocido como **TestMySprites**) es una plataforma web poderosa diseñada para desarrolladores de juegos, animadores y artistas digitales para probar, previsualizar y ajustar animaciones de sprites en tiempo real. Construida con Next.js, TypeScript y HTML5 Canvas, proporciona un espacio de trabajo intuitivo para el análisis de hojas de sprites y pruebas de animación.

## Características

### **Espacio de Trabajo de Canvas Interactivo**
- **Canvas Infinito**: Arrastra, mueve y posiciona sprites libremente por el espacio de trabajo
- **Renderizado en Tiempo Real**: Ve tus sprites animarse mientras realizas cambios
- **Soporte Multi-sprite**: Prueba múltiples sprites simultáneamente
- **Zoom y Panorámica**: Navega hojas de sprites grandes con facilidad

### **Barra de Herramientas de Acciones Rápidas**
- **Crear Sprite**: Define fuente de imagen, grilla de sprite (filas/columnas), escala e ignora frames específicos
- **Crear Formas**: Añade círculos y rectángulos para referencia y pruebas
- **Creación Instantánea**: Generación de sprites con un clic y valores predeterminados inteligentes

### **Panel de Control Avanzado**
- **Gestión de Sprites**: Ve todos los sprites activos en un panel organizado y colapsable
- **Controles de Animación**: Reproduce, pausa y controla animaciones de sprites individuales
- **Control de Velocidad**: Ajusta la velocidad de animación de 0x a 10x con deslizador de precisión
- **Configuración de Bucle**: Alterna entre modos de reproducción única y bucle continuo
- **Modo Debug**: Depuración visual con información de frames, límites y datos de rendimiento

### **Pruebas en Tiempo Real**
- **Vista Previa en Vivo**: Ve cambios instantáneamente mientras ajustas parámetros
- **Análisis de Frames**: Monitorea frame actual, velocidad y estado de bucle
- **Seguimiento de Posición**: Visualización de coordenadas en tiempo real
- **Monitoreo de Rendimiento**: El modo debug muestra información detallada del sprite

## Comenzando

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm, o bun

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd spritev2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

4. **Abrir tu navegador**
   Navega a [http://localhost:3000](http://localhost:3000) para comenzar a usar SpriteTools.

## Arquitectura

### Componentes Principales
- **Motor de Renderizado**: Sistema de renderizado personalizado basado en Canvas
- **Sistema de Formas**: Clases de formas modulares (Sprite, Círculo, Rectángulo)
- **Gestor de Animación**: Animación basada en frames con control de tiempo
- **Componentes UI**: Arquitectura de componentes React escalable

### Tecnologías Clave
- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS con animaciones personalizadas
- **Canvas**: API HTML5 Canvas para renderizado de alto rendimiento
- **Gestión de Estado**: React hooks y context

## Características Próximas

### **Creación de Sprites Mejorada**
- **Arrastrar y Soltar**: Importa hojas de sprites directamente desde el sistema de archivos
- **Analizador de Hojas de Sprites**: Detección automática de grilla y conteo de frames
- **Importación en Lote**: Carga múltiples sprites a la vez
- **Secuencias de Frames Personalizadas**: Define patrones de animación complejos

### **Herramientas de Canvas Avanzadas**
- **Redimensionamiento de Sprites**: Manijas de redimensionamiento interactivas con bloqueo de proporción
- **Multi-selección**: Selecciona y manipula múltiples sprites
- **Herramientas de Alineación**: Ajuste a grilla, guías de alineación y herramientas de distribución
- **Sistema de Capas**: Organiza sprites en capas con control de z-index

### **Características Profesionales**
- **Opciones de Exportación**: Exporta animaciones como GIF, MP4 o hojas de sprites
- **Análisis de Rendimiento**: Monitoreo de frame rate y sugerencias de optimización
- **Colaboración**: Comparte espacios de trabajo y colabora en tiempo real
- **Gestión de Proyectos**: Guarda, carga y organiza proyectos de sprites

### **Herramientas de Desarrollador**
- **Generación de Código**: Genera código de animación de sprites para motores de juegos populares
- **Integración de API**: Conecta con frameworks de desarrollo de juegos
- **Procesamiento en Lote**: Automatiza optimización y procesamiento de sprites

## Contribuyendo

¡Damos la bienvenida a contribuciones! Por favor, siéntete libre de enviar issues, solicitudes de características o pull requests.

### Configuración de Desarrollo
1. Haz fork del repositorio
2. Crea una rama de característica: `git checkout -b feature/caracteristica-increible`
3. Confirma tus cambios: `git commit -m 'Añadir característica increíble'`
4. Empuja a la rama: `git push origin feature/caracteristica-increible`
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para detalles.

---

**SpriteTools** - Haciendo las pruebas de animación de sprites fáciles y profesionales.