'use client';
import { useState, useRef } from "react";
import Link from "next/link";

function SimpleEditableText({ 
  text, 
  isEditing, 
  onSave,
  className = "",
  multiline = false,
  placeholder = "Escribe aquí...",
  onSelect,
  isSelected = false,
  isEditingThisElement = false,
  elementId,
  styles = {},
  onStartEdit
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
      if (multiline) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
      }
    }
  }, [isEditingThisElement]);

  const handleContainerClick = (e) => {
    if (isEditing && !isEditingThisElement) {
      e.stopPropagation();
      if (onSelect) {
        onSelect({
          type: multiline ? 'description' : 'title',
          id: elementId,
          text: value,
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
          type: multiline ? 'description' : 'title',
          id: elementId,
          text: value,
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
      if (e.key === 'Enter' && !e.shiftKey && !multiline) {
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
    if (multiline && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
    }
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

  if (isEditingThisElement) {
    if (multiline) {
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
            className={`edit-textarea ${applyStyles()} break-words whitespace-normal contain-text p-2 rounded`}
            style={{
              minHeight: '60px',
              maxHeight: '150px',
              height: 'auto',
              color: localStyles?.color || 'inherit'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="edit-btn edit-btn-save" title="Guardar">✓</button>
            <button onClick={handleCancel} className="edit-btn edit-btn-cancel" title="Cancelar">✕</button>
          </div>
        </div>
      );
    } else {
      return (
        <div 
          ref={containerRef}
          className={`editable-container editing ${className}`}
          onClick={handleContainerClick}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`edit-input ${applyStyles()} break-words whitespace-normal contain-text p-2 rounded`}
            style={{
              color: localStyles?.color || 'inherit'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="edit-btn edit-btn-save" title="Guardar">✓</button>
            <button onClick={handleCancel} className="edit-btn edit-btn-cancel" title="Cancelar">✕</button>
          </div>
        </div>
      );
    }
  }

  if (isEditing) {
    return (
      <div 
        ref={containerRef}
        className={`editable-container ${isSelected ? 'selected' : 'editable-hover'} ${className}`}
        onClick={handleContainerClick}
      >
        <div
          onClick={handleTextClick}
          className={`${applyStyles()} break-words whitespace-normal overflow-hidden text-contain p-2 min-h-[44px] flex items-center transition-all duration-200 text-selection ${
            value === placeholder ? 'text-gray-400 italic' : ''
          }`}
          style={{
            color: localStyles?.color || 'inherit',
            cursor: 'pointer'
          }}
        >
          {value || placeholder}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${className} ${applyStyles()} break-words whitespace-normal overflow-hidden text-contain ${
        value === placeholder ? 'text-gray-400 italic' : ''
      }`}
      style={{
        color: localStyles?.color || 'inherit'
      }}
    >
      {value || text}
    </div>
  );
}

export default function EditableCard({ 
  title, 
  description, 
  link, 
  bgColor = "bg-white", 
  borderColor = "border-gray-200",
  isEditing, 
  onSave,
  onSelect,
  isSelected = false,
  isEditingThisElement = false,
  cardId,
  titleStyles = {},
  descriptionStyles = {},
  onStartEdit
}) {
  const containerRef = useRef(null);

  const handleTitleSave = (newTitle) => {
    if (onSave) onSave({ type: 'title', value: newTitle, cardId });
  };

  const handleDescriptionSave = (newDescription) => {
    if (onSave) onSave({ type: 'description', value: newDescription, cardId });
  };

  const handleElementSelect = (element) => {
    if (onSelect) {
      onSelect({
        ...element,
        cardId: cardId
      });
    }
  };

  const handleCardClick = (e) => {
    if (isEditing && !isEditingThisElement) {
      e.stopPropagation();
      if (onSelect) {
        onSelect({
          type: 'card',
          id: cardId,
          text: title
        });
      }
    }
  };

  const CardContent = () => (
    <div 
      ref={containerRef}
      className={`p-4 rounded-lg border-2 ${borderColor} ${bgColor} shadow-sm hover:shadow-md transition-all duration-300 min-h-[160px] flex flex-col overflow-hidden w-full editable-container ${isSelected ? 'selected' : isEditing ? 'editable-hover' : ''}`}
      onClick={handleCardClick}
    >
      <div className="mb-3 min-h-[52px] flex items-start overflow-hidden">
        <SimpleEditableText
          text={title}
          isEditing={isEditing}
          onSave={handleTitleSave}
          onSelect={handleElementSelect}
          isSelected={isSelected}
          isEditingThisElement={isEditingThisElement}
          elementId={`${cardId}-title`}
          styles={titleStyles}
          onStartEdit={onStartEdit}
          className="text-lg font-semibold w-full line-clamp-2"
          multiline={false}
          placeholder="Título de la tarjeta..."
        />
      </div>
      
      <div className="flex-grow min-h-[68px] overflow-hidden">
        <SimpleEd
