'use client';
import { useState, useEffect } from 'react';

export default function EditPanel({ isOpen, onStyleChange, selectedElement }) {
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: '#000000',
    fontSize: 'medium',
    align: 'left'
  });

  const colors = [
    '#000000', '#374151', '#6b7280', '#ef4444', '#f59e0b',
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff',
    '#dc2626', '#ea580c', '#84cc16', '#06b6d4', '#8b5cf6'
  ];

  const fontSizes = [
    { label: 'S', value: 'small', class: 'text-sm' },
    { label: 'M', value: 'medium', class: 'text-base' },
    { label: 'L', value: 'large', class: 'text-lg' },
    { label: 'XL', value: 'xlarge', class: 'text-xl' }
  ];

  const alignments = [
    { label: 'Izq', value: 'left', icon: '⫷' },
    { label: 'Centro', value: 'center', icon: '⫸' },
    { label: 'Der', value: 'right', icon: '⫹' }
  ];

  useEffect(() => {
    if (selectedElement && selectedElement.styles) {
      setActiveStyles(selectedElement.styles);
    }
  }, [selectedElement]);

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

  if (!isOpen) return null;

  return (
    <div className="edit-panel-compact">
      <div className="panel-header">
        <h2 className="text-lg font-semibold">Editor</h2>
        <p className="text-blue-100 text-sm mt-1">
          {selectedElement ? `Editando: ${selectedElement.type}` : 'Selecciona un texto'}
        </p>
      </div>

      <div className="panel-content">
        {/* Estilos de texto */}
        <div className="control-group">
          <h3>Estilos</h3>
          <div className="control-grid">
            <button
              className={`control-button ${activeStyles.bold ? 'active' : ''}`}
              onClick={() => handleStyleToggle('bold', !activeStyles.bold)}
            >
              <span className="font-bold">B</span>
              <span>Negrita</span>
            </button>
            
            <button
              className={`control-button ${activeStyles.italic ? 'active' : ''}`}
              onClick={() => handleStyleToggle('italic', !activeStyles.italic)}
            >
              <span className="italic">I</span>
              <span>Cursiva</span>
            </button>
            
            <button
              className={`control-button ${activeStyles.underline ? 'active' : ''}`}
              onClick={() => handleStyleToggle('underline', !activeStyles.underline)}
            >
              <span className="underline">U</span>
              <span>Subrayado</span>
            </button>
          </div>
        </div>

        {/* Tamaño de fuente */}
        <div className="control-group">
          <h3>Tamaño</h3>
          <div className="size-grid">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                className={`size-option ${activeStyles.fontSize === size.value ? 'active' : ''}`}
                onClick={() => handleFontSizeSelect(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color de texto */}
        <div className="control-group">
          <h3>Color</h3>
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-option ${activeStyles.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Alineación */}
        <div className="control-group">
          <h3>Alineación</h3>
          <div className="align-grid">
            {alignments.map((align) => (
              <button
                key={align.value}
                className={`align-option ${activeStyles.align === align.value ? 'active' : ''}`}
                onClick={() => handleAlignSelect(align.value)}
                title={align.label}
              >
                {align.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="control-group">
          <h3>Vista Previa</h3>
          <div className="preview-box">
            <p 
              className={`preview-text ${applyStylesToText()}`}
              style={{ color: activeStyles.color }}
            >
              Texto de ejemplo
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="action-buttons">
          <button 
            className="action-btn reset"
            onClick={() => handleStyleToggle('bold', false)}
          >
            Resetear Estilos
          </button>
          <button 
            className="action-btn apply"
            onClick={() => console.log('Estilos aplicados:', activeStyles)}
          >
            Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
