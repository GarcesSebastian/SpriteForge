# SpriteTools - Advanced Sprite Testing Platform

**SpriteTools** (also known as **TestMySprites**) is a powerful, web-based platform designed for game developers, animators, and digital artists to test, preview, and fine-tune sprite animations in real-time. Built with Next.js, TypeScript, and HTML5 Canvas, it provides an intuitive workspace for sprite sheet analysis and animation testing.

## Features

### **Interactive Canvas Workspace**
- **Infinite Canvas**: Drag, move, and position sprites freely across the workspace
- **Real-time Rendering**: See your sprites animate as you make changes
- **Multi-sprite Support**: Test multiple sprites simultaneously
- **Zoom & Pan**: Navigate large sprite sheets with ease

### **Quick Actions Toolbar**
- **Create Sprite**: Define image source, sprite grid (rows/cols), scale, and ignore specific frames
- **Create Shapes**: Add circles and rectangles for reference and testing
- **Instant Creation**: One-click sprite generation with smart defaults

### **Advanced Control Panel**
- **Sprite Management**: View all active sprites in a collapsible, organized panel
- **Animation Controls**: Play, pause, and control individual sprite animations
- **Speed Control**: Adjust animation speed from 0x to 10x with precision slider
- **Loop Settings**: Toggle between single-play and continuous loop modes
- **Debug Mode**: Visual debugging with frame info, boundaries, and performance data

### **Real-time Testing**
- **Live Preview**: See changes instantly as you adjust parameters
- **Frame Analysis**: Monitor current frame, speed, and loop status
- **Position Tracking**: Real-time coordinate display
- **Performance Monitoring**: Debug mode shows detailed sprite information

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spritev2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start using SpriteTools.

## Architecture

### Core Components
- **Render Engine**: Custom Canvas-based rendering system
- **Shape System**: Modular shape classes (Sprite, Circle, Rectangle)
- **Animation Manager**: Frame-based animation with timing control
- **UI Components**: Scalable React component architecture

### Key Technologies
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Canvas**: HTML5 Canvas API for high-performance rendering
- **State Management**: React hooks and context

## Upcoming Features

### **Enhanced Sprite Creation**
- **Drag & Drop**: Import sprite sheets directly from file system
- **Sprite Sheet Analyzer**: Automatic grid detection and frame counting
- **Batch Import**: Load multiple sprites at once
- **Custom Frame Sequences**: Define complex animation patterns

### **Advanced Canvas Tools**
- **Sprite Resizing**: Interactive resize handles with aspect ratio lock
- **Multi-selection**: Select and manipulate multiple sprites
- **Alignment Tools**: Snap-to-grid, alignment guides, and distribution tools
- **Layers System**: Organize sprites in layers with z-index control

### **Professional Features**
- **Export Options**: Export animations as GIF, MP4, or sprite sheets
- **Performance Analytics**: Frame rate monitoring and optimization suggestions
- **Collaboration**: Share workspaces and collaborate in real-time
- **Project Management**: Save, load, and organize sprite projects

### **Developer Tools**
- **Code Generation**: Generate sprite animation code for popular game engines
- **API Integration**: Connect with game development frameworks
- **Batch Processing**: Automate sprite optimization and processing

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**SpriteTools** - Making sprite animation testing effortless and professional.
