'use client';
import { useState, useEffect, useRef } from "react";

export default function EditableText({ 
  text, 
  tag = "p", 
  isEditing, 
  onSave, 
  className = "",
  placeholder = "Escribe aquí...",
  onSelect,
  isSelected = false,
  isEditingThisElement = false,
  elementId,
  styles = {},
  onStartEdit,
  onApplyStyles
}) {
  const [value, setValue] = useState(text);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [originalValue, setOriginalValue] = useState(text);
  const [localStyles, setLocalStyles] = useState(styles);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setValue(text);
    setOriginalValue(text);
  }, [text]);

  useEffect(() => {
    setLocalStyles(styles);
  }, [styles]);

  useEffect(() => {
    if (isEditingThisElement && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, value.length);
      adjustTextareaHeight();
    }
  }, [isEditingThisElement]);

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  };

  const handleContainerClick = (e) => {
    if (isEditing && !isEditingLocal && !isEditingThisElement) {
      e.stopPropagation();
      if (onSelect) {
        onSelect({
          type: 'text',
          id: elementId,
          text: value,
          element: tag,
          styles: localStyles
        });
      }
      if (onStartEdit) {
        onStartEdit(elementId);
      }
    }
  };

  const handleTextClick = (e) => {
    if (isEditing && !isEditingThisElement) {
      e.stopPropagation();
      if (onSelect) {
        onSelect({
          type: 'text',
          id: elementId,
          text: value,
          element: tag,
          styles: localStyles
        });
      }
      if (onStartEdit) {
        onStartEdit(elementId);
      }
    }
  };

  const handleBlur = () => {
    if (isEditingThisElement) {
      handleSave();
    }
  };

  const handleKeyDown = (e) => {
    if (isEditingThisElement) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleSave = () => {
    if (onStartEdit) {
      onStartEdit(null);
    }
    const finalValue = value.trim() === "" ? originalValue : value;
    
    if (onSave && finalValue !== originalValue) {
      onSave(finalValue);
      setOriginalValue(finalValue);
    }
  };

  const handleCancel = () => {
    if (onStartEdit) {
      onStartEdit(null);
    }
    setValue(originalValue);
  };

  // Aplicar estilos individuales
  const applyStyles = () => {
    let styleClasses = '';
    
    if (localStyles.bold) styleClasses += 'font-bold ';
    if (localStyles.italic) styleClasses += 'italic ';
    if (localStyles.underline) styleClasses += 'underline ';
    
    switch (localStyles.fontSize) {
      case 'small': styleClasses += 'text-sm '; break;
      case 'large': styleClasses += 'text-lg '; break;
      case 'xlarge': styleClasses += 'text-xl '; break;
      default: styleClasses += 'text-base ';
    }

    switch (localStyles.align) {
      case 'center': styleClasses += 'text-center '; break;
      case 'right': styleClasses += 'text-right '; break;
      default: styleClasses += 'text-left ';
    }

    return styleClasses;
  };

  const Tag = tag;

  if (isEditingThisElement) {
    return (
      <div 
        ref={containerRef}
        className={`editable-container editing ${className}`}
        onClick={handleContainerClick}
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`edit-textarea ${applyStyles()} break-words whitespace-normal contain-text p-3 rounded`}
          style={{
            minHeight: '44px',
            maxHeight: '200px',
            height: 'auto',
            color: localStyles?.color || 'inherit'
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="edit-actions">
          <button 
            onClick={handleSave}
            className="edit-btn edit-btn-save"
            title="Guardar (Enter)"
          >
            ✓
          </button>
          <button 
            onClick={handleCancel}
            className="edit-btn edit-btn-cancel"
            title="Cancelar (Esc)"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div 
        ref={containerRef}
        className={`editable-container ${isSelected ? 'selected' : 'editable-hover'} ${className}`}
        onClick={handleContainerClick}
      >
        <Tag
          onClick={handleTextClick}
          className={`${applyStyles()} break-words whitespace-normal overflow-hidden text-contain p-3 min-h-[44px] flex items-center transition-all duration-200 text-selection ${
            value === placeholder ? 'text-gray-400 italic' : ''
          }`}
          style={{
            color: localStyles?.color || 'inherit',
            cursor: 'pointer'
          }}
        >
          {value || placeholder}
        </Tag>
      </div>
    );
  }

  return (
    <Tag 
      className={`${className} ${applyStyles()} break-words whitespace-normal overflow-hidden text-contain ${
        value === placeholder ? 'text-gray-400 italic' : ''
      }`}
      style={{
        color: localStyles?.color || 'inherit'
      }}
    >
      {value || text}
    </Tag>
  );
}
