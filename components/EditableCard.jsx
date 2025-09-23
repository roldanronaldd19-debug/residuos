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
  onEditStart,
  elementId,
  isActive,
  localStyles
}) {
  const [value, setValue] = useState(text);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [originalValue, setOriginalValue] = useState(text);
  const inputRef = useRef(null);

  const handleBlur = () => {
    handleSave();
  };

  const handleClick = () => {
    if (isEditing && !isEditingLocal) {
      setIsEditingLocal(true);
      if (onEditStart && elementId) onEditStart(elementId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (inputRef.current && multiline) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
    }
  };

  const handleSave = () => {
    setIsEditingLocal(false);
    const finalValue = value.trim() === "" ? originalValue : value;
    
    if (onSave && finalValue !== originalValue) {
      onSave(finalValue, elementId);
      setOriginalValue(finalValue);
    }
  };

  const handleCancel = () => {
    setIsEditingLocal(false);
    setValue(originalValue);
  };

  // Aplicar estilos solo si este elemento está activo
  const applyStyles = () => {
    if (!isActive || !localStyles) return '';
    
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

  if (isEditing && isEditingLocal) {
    if (multiline) {
      return (
        <div className={`relative editable-element editing ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${className} ${applyStyles()} w-full resize-none overflow-hidden break-words whitespace-normal contain-text bg-transparent outline-none rounded-lg p-2`}
            style={{
              minHeight: '60px',
              maxHeight: '150px',
              height: 'auto',
              color: (isActive && localStyles?.color) || 'inherit'
            }}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="edit-btn edit-btn-save" title="Guardar">✓</button>
            <button onClick={handleCancel} className="edit-btn edit-btn-cancel" title="Cancelar">✕</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`relative editable-element editing ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${className} ${applyStyles()} w-full break-words whitespace-normal contain-text bg-transparent outline-none rounded-lg p-2`}
            style={{
              color: (isActive && localStyles?.color) || 'inherit'
            }}
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
        onClick={handleClick}
        className={`${className} ${applyStyles()} editable-element edit-ready edit-tooltip break-words whitespace-normal overflow-hidden text-contain rounded-lg p-2 min-h-[44px] flex items-center smooth-transition ${
          value === placeholder ? 'text-gray-400 italic' : ''
        } ${isActive ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
        style={{
          color: (isActive && localStyles?.color) || 'inherit'
        }}
      >
        {value || placeholder}
      </div>
    );
  }

  return (
    <div className={`${className} break-words whitespace-normal overflow-hidden text-contain ${
      value === placeholder ? 'text-gray-400 italic' : ''
    }`}>
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
  onEditStart,
  elementIdPrefix,
  isActive,
  localStyles
}) {
  const handleTitleSave = (newTitle) => {
    if (onSave) onSave(newTitle, `${elementIdPrefix}-title`);
  };

  const handleDescriptionSave = (newDescription) => {
    if (onSave) onSave(newDescription, `${elementIdPrefix}-desc`);
  };

  const CardContent = () => (
    <div className={`p-4 rounded-lg border-2 ${borderColor} ${bgColor} shadow-sm hover:shadow-md transition-all duration-300 min-h-[160px] flex flex-col overflow-hidden w-full smooth-transition ${
      isEditing ? 'card-editable edit-mode' : ''
    }`}>
      <div className="mb-3 min-h-[52px] flex items-start overflow-hidden">
        <SimpleEditableText
          text={title}
          isEditing={isEditing}
          onSave={handleTitleSave}
          onEditStart={onEditStart}
          elementId={`${elementIdPrefix}-title`}
          isActive={isActive && elementIdPrefix && isActive.includes(`${elementIdPrefix}-title`)}
          localStyles={localStyles}
          className="text-lg font-semibold text-gray-800 w-full line-clamp-2"
          multiline={false}
          placeholder="Título de la tarjeta..."
        />
      </div>
      
      <div className="flex-grow min-h-[68px] overflow-hidden">
        <SimpleEditableText
          text={description}
          isEditing={isEditing}
          onSave={handleDescriptionSave}
          onEditStart={onEditStart}
          elementId={`${elementIdPrefix}-desc`}
          isActive={isActive && elementIdPrefix && isActive.includes(`${elementIdPrefix}-desc`)}
          localStyles={localStyles}
          className="text-sm text-gray-600 w-full line-clamp-3"
          multiline={true}
          placeholder="Descripción de la tarjeta..."
        />
      </div>
      
      {!isEditing && link && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <span className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
            Ver más →
          </span>
        </div>
      )}
    </div>
  );

  if (isEditing || !link) {
    return <CardContent />;
  }

  return (
    <Link href={link} className="block w-full smooth-transition">
      <CardContent />
    </Link>
  );
}
