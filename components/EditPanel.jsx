'use client';
import { useState, useEffect } from 'react';

export default function EditPanel({ isOpen, onClose, onStyleChange, selectedElement }) {
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: '#000000',
    fontSize: 'medium',
    align: 'left'
  });

  const colors = [
    '#000000', '#374151', '#6b7280', '#ef4444', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#ffffff'
  ];

  const fontSizes = [
    { label: 'Peq', value: 'small' },
    { label: 'Med', value: 'medium' },
    { label: 'Gr', value: 'large' },
    { label: 'XG', value: 'xlarge' }
  ];

  const alignments = [
    { label: 'Izq', value: 'left', icon: '⫷' },
    { label: 'Cen', value: 'center', icon: '⫸' },
    { label: 'Der', value: 'right', icon: '⫹' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('editing-mode');
    } else {
      document.body.classList.remove('editing-mode');
    }
  }, [isOpen]);

  const handleStyleToggle = (style, value) => {
    const newStyles = {
      ...activeStyles,
      [style]: value
    };
    setActiveStyles(newStyles);
    onStyleChange(newStyles);
  };

  const handleColorSelect = (color) => {
    handleStyleToggle('color', color);
  };

  const handleFontSizeSelect = (size) => {
    handleStyleToggle('fontSize', size);
  };

  const handleAlignSelect = (align) => {
    handleStyleToggle('align', align);
  };

  const applyStylesToText = () => {
    let styleString = '';
    
    if (activeStyles.bold) styleString += 'font-bold ';
    if (activeStyles.italic) styleString += 'italic ';
    if (activeStyles.underline) styleString += 'underline ';
    
    switch (activeStyles.fontSize) {
      case 'small': styleString += 'text-sm '; break;
      case 'large': styleString += 'text-lg '; break;
      case 'xlarge': styleString += 'text-xl '; break;
      default: styleString += 'text-base ';
    }

    switch (activeStyles.align) {
      case 'center': styleString += 'text-center '; break;
      case 'right': styleString += 'text-right '; break;
      default: styleString += 'text-left ';
    }

    return styleString;
  };

  const resetStyles = () => {
    const defaultStyles = {
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
      fontSize: 'medium',
      align: 'left'
    };
    setActiveStyles(defaultStyles);
    onStyleChange(defaultStyles);
  };

  return (
    <div className={`edit-panel-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="edit-panel-header">
        <div>
          <h2 className="text-sm font-semibold">Editor</h2>
          <p className="text-xs opacity-90">Selecciona y edita elementos</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 text-lg"
          title="Cerrar editor"
        >
          ✕
        </button>
      </div>

      <div className="edit-panel-content">
        {/* Elemento seleccionado */}
        <div className="edit-panel-section">
          <h3>Elemento Seleccionado</h3>
          <div className="p-3 bg-gray-50 rounded-lg text-xs">
            {selectedElement ? (
              <div>
                <div className="font-medium">{selectedElement.type}</div>
                <div className="text-gray-600 truncate">{selectedElement.text}</div>
              </div>
            ) : (
              <div className="text-gray-500">Haz clic en un elemento para editarlo</div>
            )}
          </div>
        </div>

        {/* Estilos de texto */}
        <div className="edit-panel-section">
          <h3>Estilos</h3>
          <div className="compact-controls">
            <div className="flex gap-2">
              <button
                className={`compact-button flex-1 ${activeStyles.bold ? 'active' : ''}`}
                onClick={() => handleStyleToggle('bold', !activeStyles.bold)}
              >
                <span className="font-bold">B</span>
              </button>
              <button
                className={`compact-button flex-1 ${activeStyles.italic ? 'active' : ''}`}
                onClick={() => handleStyleToggle('italic', !activeStyles.italic)}
              >
                <span className="italic">I</span>
              </button>
              <button
                className={`compact-button flex-1 ${activeStyles.underline ? 'active' : ''}`}
                onClick={() => handleStyleToggle('underline', !activeStyles.underline)}
              >
                <span className="underline">U</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tamaño de fuente */}
        <div className="edit-panel-section">
          <h3>Tamaño</h3>
          <div className="font-size-controls-compact">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                className={`font-size-btn-compact ${activeStyles.fontSize === size.value ? 'active' : ''}`}
                onClick={() => handleFontSizeSelect(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color de texto */}
        <div className="edit-panel-section">
          <h3>Color</h3>
          <div className="color-palette-compact">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-option-compact ${activeStyles.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Alineación */}
        <div className="edit-panel-section">
          <h3>Alineación</h3>
          <div className="text-align-controls-compact">
            {alignments.map((align) => (
              <button
                key={align.value}
                className={`text-align-btn-compact ${activeStyles.align === align.value ? 'active' : ''}`}
                onClick={() => handleAlignSelect(align.value)}
                title={align.label}
              >
                {align.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="edit-panel-section">
          <h3>Vista Previa</h3>
          <div className="preview-compact">
            <p 
              className={applyStylesToText()}
              style={{ color: activeStyles.color }}
            >
              Texto ejemplo
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="action-buttons">
          <button 
            className="action-btn action-btn-secondary"
            onClick={resetStyles}
          >
            ↺ Resetear Estilos
          </button>
          <button 
            className="action-btn action-btn-primary"
            onClick={() => console.log('Aplicar estilos')}
          >
            💾 Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
