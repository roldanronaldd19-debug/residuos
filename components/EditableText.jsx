'use client';
import { useState, useEffect, useRef } from "react";

export default function EditableText({ 
  text, 
  tag = "p", 
  isEditing, 
  onSave, 
  className = "",
  placeholder = "Escribe aquí...",
  elementId,
  isSelected,
  onSelect,
  currentStyles,
  onStylesChange
}) {
  const [value, setValue] = useState(text);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [originalValue, setOriginalValue] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(text);
    setOriginalValue(text);
  }, [text]);

  useEffect(() => {
    if (isEditingLocal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(value.length, value.length);
      adjustTextareaHeight();
    }
  }, [isEditingLocal]);

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isEditing && !isEditingLocal) {
      if (onSelect) {
        onSelect(elementId);
      }
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (isEditing && !isEditingLocal) {
      setIsEditingLocal(true);
      if (onSelect) {
        onSelect(elementId);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleSave = () => {
    setIsEditingLocal(false);
    const finalValue = value.trim() === "" ? originalValue : value;
    
    if (onSave && finalValue !== originalValue) {
      onSave(finalValue, elementId);
      setOriginalValue(finalValue);
    } else if (finalValue !== value) {
      setValue(finalValue);
    }
  };

  const handleCancel = () => {
    setIsEditingLocal(false);
    setValue(originalValue);
  };

  // Aplicar estilos desde el panel
  const applyStyles = () => {
    if (!currentStyles) return '';
    
    let styleClasses = '';
    
    if (currentStyles.bold) styleClasses += 'font-bold ';
    if (currentStyles.italic) styleClasses += 'italic ';
    if (currentStyles.underline) styleClasses += 'underline ';
    
    switch (currentStyles.fontSize) {
      case 'small': styleClasses += 'text-sm '; break;
      case 'large': styleClasses += 'text-lg '; break;
      case 'xlarge': styleClasses += 'text-xl '; break;
      default: styleClasses += 'text-base ';
    }

    switch (currentStyles.align) {
      case 'center': styleClasses += 'text-center '; break;
      case 'right': styleClasses += 'text-right '; break;
      default: styleClasses += 'text-left ';
    }

    return styleClasses;
  };

  const Tag = tag;

  if (isEditing && isEditingLocal) {
    return (
      <div className={`editable-element editing ${isSelected ? 'selected' : ''}`}>
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${className} ${applyStyles()} w-full resize-none overflow-hidden break-words whitespace-normal contain-text bg-transparent outline-none rounded-lg p-3`}
          style={{
            minHeight: '44px',
            maxHeight: '200px',
            height: 'auto',
            color: currentStyles?.color || 'inherit'
          }}
        />
        {isSelected && <div className="selected-indicator">✓</div>}
      </div>
    );
  }

  if (isEditing) {
    return (
      <Tag
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`${className} ${applyStyles()} editable-element edit-ready break-words whitespace-normal overflow-hidden text-contain rounded-lg p-3 min-h-[44px] flex items-center smooth-transition ${
          isSelected ? 'selected' : ''
        } ${value === placeholder ? 'text-gray-400 italic' : ''}`}
        style={{
          color: currentStyles?.color || 'inherit'
        }}
      >
        {value || placeholder}
        {isSelected && <div className="selected-indicator">✎</div>}
      </Tag>
    );
  }

  return (
    <Tag className={`${className} ${applyStyles()} break-words whitespace-normal overflow-hidden text-contain ${
      value === placeholder ? 'text-gray-400 italic' : ''
    }`}
    style={{
      color: currentStyles?.color || 'inherit'
    }}>
      {value || text}
    </Tag>
  );
}
