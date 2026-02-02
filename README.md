# Cartpanda Upsell Funnel Builder

A production-grade React application for creating and managing sales funnels through an intuitive drag-and-drop interface.

## Features

✨ **Visual Funnel Builder**
- Drag-and-drop node creation
- Visual connection between funnel steps
- Real-time validation with error/warning indicators
- Auto-incrementing node labels

🎨 **Node Types**
- **Sales Page** - Initial landing page
- **Order Page** - Checkout and order form
- **Upsell** - Additional product offers
- **Downsell** - Alternative lower-priced offers
- **Thank You** - Final confirmation page

💾 **Persistence & Export**
- Auto-save to localStorage (300ms debounce)
- Export funnel as JSON
- Import funnel from JSON file
- Versioned schema for future compatibility

♿ **Accessibility (WCAG 2.1 AA)**
- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast ratios (4.5:1 for text)
- Focus indicators on all interactive elements
- Reduced motion support

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Flow** - Canvas-based node editor
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Usage

### Creating a Funnel

1. **Add Nodes**: Drag node types from the left palette onto the canvas
2. **Connect Nodes**: Click and drag from the right handle of one node to the left handle of another
3. **Validate**: Check the toolbar for validation status (errors/warnings)
4. **Save**: Your funnel auto-saves to localStorage every 300ms

### Keyboard Shortcuts

- `Tab` - Navigate between interactive elements
- `Arrow Keys` - Move selected nodes
- `Delete` - Remove selected node or edge
- `Escape` - Cancel current operation

### Export/Import

- **Export**: Click "Export JSON" in the toolbar to download your funnel
- **Import**: Click "Import JSON" and select a previously exported file
- **Clear**: Click "Clear Canvas" to remove all nodes and start fresh

## Project Structure

```
src/
├── components/
│   ├── canvas/          # React Flow canvas components
│   ├── palette/         # Node palette sidebar
│   ├── toolbar/         # Top toolbar with controls
│   └── ui/              # Reusable UI components
├── hooks/
│   ├── useFunnelState.ts    # Zustand store
│   ├── usePersistence.ts    # localStorage sync
│   └── use-toast.ts         # Toast notifications
├── lib/
│   ├── nodeTypes.ts     # Node type configurations
│   ├── validation.ts    # Funnel validation logic
│   ├── export.ts        # JSON export/import
│   └── utils.ts         # Utility functions
├── types/
│   └── funnel.ts        # TypeScript type definitions
├── App.tsx              # Main application component
└── main.tsx             # React entry point
```

## Validation Rules

The funnel builder enforces the following rules:

- ✅ **Thank You nodes** cannot have outgoing connections (enforced)
- ⚠️ **Disconnected nodes** trigger warnings
- ⚠️ **Nodes without next steps** (except Thank You) trigger warnings

## Accessibility Features

### Keyboard Navigation
- All nodes and controls are keyboard accessible
- Logical tab order throughout the application
- Visual focus indicators on all interactive elements

### Screen Reader Support
- Semantic HTML structure
- ARIA labels on all interactive elements
- Live region announcements for state changes
- Descriptive button and link text

### Visual Accessibility
- 4.5:1 contrast ratio for all text
- Color is not the only indicator (icons + text)
- Reduced motion support via CSS media query
- Visible focus rings (2px)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Architecture Highlights

- **Feature-based architecture** - Clear separation of concerns
- **Type-safe** - Full TypeScript coverage with strict mode
- **Accessible by default** - WCAG 2.1 AA compliance
- **Performance optimized** - React.memo, debounced saves, code splitting ready
- **Maintainable** - Clear folder structure, consistent patterns

## License

MIT

## Author

Built for Cartpanda Front-end Engineer Practical Test
