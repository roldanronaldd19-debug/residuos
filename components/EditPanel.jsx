'use client';
import { useState, useEffect } from 'react';

export default function EditPanel({ 
  isOpen, 
  onClose, 
  onStyleChange, 
  selectedElement 
}) {
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
    { label: 'Grnd', value: 'large' }
  ];

  const alignments = [
    { label: '⫷', value: 'left', title: 'Izquierda' },
    { label: '⫸', value: 'center', title: 'Centro' },
    { label: '⫹', value: 'right', title: 'Derecha' }
  ];

  // Actualizar estilos cuando cambia el elemento seleccionado
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

  const applyStyles = () => {
    // Los estilos ya se aplican automáticamente
    console.log('Estilos aplicados:', activeStyles);
  };

  const applyStylesToText = () => {
    let styleString = '';
    
    if (activeStyles.bold) styleString += 'font-bold ';
    if (activeStyles.italic) styleString += 'italic ';
    if (activeStyles.underline) styleString += 'underline ';
    
    switch (activeStyles.fontSize) {
      case 'small': styleString += 'text-sm '; break;
      case 'large': styleString += 'text-lg '; break;
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
    <>
      <div className="edit-panel-overlay" onClick={onClose} />
      
      <div className="edit-panel open">
        <div className="edit-panel-header">
          <h2>Editor de Texto</h2>
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
            <h3>Editando:</h3>
            <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
              {selectedElement ? selectedElement.type : 'Ningún elemento seleccionado'}
            </div>
          </div>

          {/* Estilos de texto */}
          <div className="edit-panel-section">
            <h3>Estilos</h3>
            <div className="compact-controls">
              <button
                className={`compact-button ${activeStyles.bold ? 'active' : ''}`}
                onClick={() => handleStyleToggle('bold', !activeStyles.bold)}
                title="Negrita"
              >
                <span className="font-bold">B</span>
              </button>
              
              <button
                className={`compact-button ${activeStyles.italic ? 'active' : ''}`}
                onClick={() => handleStyleToggle('italic', !activeStyles.italic)}
                title="Cursiva"
              >
                <span className="italic">I</span>
              </button>
              
              <button
                className={`compact-button ${activeStyles.underline ? 'active' : ''}`}
                onClick={() => handleStyleToggle('underline', !activeStyles.underline)}
                title="Subrayado"
              >
                <span className="underline">U</span>
              </button>
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div className="edit-panel-section">
            <h3>Tamaño</h3>
            <div className="font-size-compact">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  className={`font-size-btn-compact ${activeStyles.fontSize === size.value ? 'active' : ''}`}
                  onClick={() => handleFontSizeSelect(size.value)}
                  title={size.label}
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
            <div className="text-align-compact">
              {alignments.map((align) => (
                <button
                  key={align.value}
                  className={`text-align-btn-compact ${activeStyles.align === align.value ? 'active' : ''}`}
                  onClick={() => handleAlignSelect(align.value)}
                  title={align.title}
                >
                  {align.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="edit-panel-section">
            <h3>Vista Previa</h3>
            <div className="preview-compact">
              <p className={applyStylesToText()} style={{ color: activeStyles.color }}>
                Aa
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="edit-panel-section">
            <div className="actions-compact">
              <button 
                className="action-btn-compact reset"
                onClick={resetStyles}
              >
                Reset
              </button>
              <button 
                className="action-btn-compact apply"
                onClick={applyStyles}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botón toggle del panel */}
      <button 
        className="edit-panel-toggle"
        onClick={onClose}
        title="Cerrar editor"
      >
        ✎
      </button>
    </>
  );
}
