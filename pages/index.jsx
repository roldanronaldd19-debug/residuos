import { useState } from "react";
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import("../components/Navbar"), { 
  ssr: false,
  loading: () => (
    <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Sistema de Residuos</div>
      <div className="bg-gray-600 px-4 py-2 rounded">Cargando...</div>
    </nav>
  )
});

const EditableCard = dynamic(() => import("../components/EditableCard"), { 
  ssr: false 
});

const EditableText = dynamic(() => import("../components/EditableText"), { 
  ssr: false 
});

const EditPanel = dynamic(() => import("../components/EditPanel"), { 
  ssr: false 
});

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [currentStyles, setCurrentStyles] = useState({});
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElementName, setSelectedElementName] = useState('');

  // IDs únicos para cada elemento editable
  const elementIds = {
    title: 'main-title',
    description: 'main-description',
    card1Title: 'card-1-title',
    card1Desc: 'card-1-desc',
    card2Title: 'card-2-title',
    card2Desc: 'card-2-desc',
    card3Title: 'card-3-title',
    card3Desc: 'card-3-desc',
    card4Title: 'card-4-title',
    card4Desc: 'card-4-desc',
    card5Title: 'card-5-title',
    card5Desc: 'card-5-desc'
  };

  const handleSave = (newValue, elementId) => {
    console.log("Texto guardado:", newValue, "para elemento:", elementId);
    // Aquí puedes guardar en Supabase con el elementId
  };

  const handleStyleChange = (styles) => {
    setCurrentStyles(styles);
  };

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    
    // Asignar nombre descriptivo para el panel
    const elementNames = {
      [elementIds.title]: 'Título Principal',
      [elementIds.description]: 'Descripción Principal',
      [elementIds.card1Title]: 'Tarjeta 1 - Título',
      [elementIds.card1Desc]: 'Tarjeta 1 - Descripción',
      [elementIds.card2Title]: 'Tarjeta 2 - Título',
      [elementIds.card2Desc]: 'Tarjeta 2 - Descripción',
      [elementIds.card3Title]: 'Tarjeta 3 - Título',
      [elementIds.card3Desc]: 'Tarjeta 3 - Descripción',
      [elementIds.card4Title]: 'Tarjeta 4 - Título',
      [elementIds.card4Desc]: 'Tarjeta 4 - Descripción',
      [elementIds.card5Title]: 'Tarjeta 5 - Título',
      [elementIds.card5Desc]: 'Tarjeta 5 - Descripción'
    };
    
    setSelectedElementName(elementNames[elementId] || 'Elemento');
  };

  const handleApplyToAll = (styles) => {
    // Aplicar estilos a todos los elementos (opcional)
    console.log("Aplicar a todos:", styles);
  };

  const handleToggleEdit = (editState) => {
    setIsEditing(editState);
    if (editState) {
      setIsEditPanelOpen(true);
    } else {
      setIsEditPanelOpen(false);
      setSelectedElement(null);
      setSelectedElementName('');
    }
  };

  const cardData = [
    { id: 1, titleId: elementIds.card1Title, descId: elementIds.card1Desc },
    { id: 2, titleId: elementIds.card2Title, descId: elementIds.card2Desc },
    { id: 3, titleId: elementIds.card3Title, descId: elementIds.card3Desc },
    { id: 4, titleId: elementIds.card4Title, descId: elementIds.card4Desc },
    { id: 5, titleId: elementIds.card5Title, descId: elementIds.card5Desc }
  ];

  const cardContent = [
    {
      title: "Indicadores",
      description: "Monitorea los principales indicadores de gestión de residuos en tiempo real",
      link: "/indicadores",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Metas",
      description: "Establece y sigue el cumplimiento de metas ambientales y de sostenibilidad",
      link: "/metas",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Avances",
      description: "Visualiza el progreso en los proyectos de sostenibilidad y gestión",
      link: "/avances",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      title: "Reportes",
      description: "Genera reportes detallados de gestión de residuos e indicadores clave",
      link: "/reportes",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Formularios",
      description: "Accede a formularios de registro, seguimiento y control de residuos",
      link: "/formularios",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${isEditing ? 'edit-mode-active' : ''}`}>
      <Navbar onToggleEdit={handleToggleEdit} />
      
      <div className={`main-content-with-panel ${isEditPanelOpen ? 'panel-open' : ''}`}>
        <main className="max-w-7xl mx-auto mt-10 p-4 sm:p-6">
          {/* Header editable */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow w-full text-contain smooth-transition">
            <div onClick={() => isEditing && handleElementSelect(elementIds.title)}>
              <EditableText
                text="Sistema de Gestión de Residuos Sólidos"
                tag="h1"
                isEditing={isEditing}
                onSave={handleSave}
                elementId={elementIds.title}
                isSelected={selectedElement === elementIds.title}
                onSelect={handleElementSelect}
                currentStyles={currentStyles}
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 break-words"
                placeholder="Título principal del sistema..."
              />
            </div>
            
            <div onClick={() => isEditing && handleElementSelect(elementIds.description)}>
              <EditableText
                text="Monitorea indicadores, gestiona metas y genera reportes de sostenibilidad para una gestión eficiente."
                tag="p"
                isEditing={isEditing}
                onSave={handleSave}
                elementId={elementIds.description}
                isSelected={selectedElement === elementIds.description}
                onSelect={handleElementSelect}
                currentStyles={currentStyles}
                className="text-base sm:text-lg text-gray-600 break-words"
                placeholder="Descripción del sistema..."
              />
            </div>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {cardData.map((card, index) => (
              <div key={card.id} className="w-full smooth-transition">
                <EditableCard
                  title={cardContent[index].title}
                  description={cardContent[index].description}
                  link={cardContent[index].link}
                  bgColor={cardContent[index].bgColor}
                  borderColor={cardContent[index].borderColor}
                  isEditing={isEditing}
                  onSave={handleSave}
                  titleId={card.titleId}
                  descId={card.descId}
                  isTitleSelected={selectedElement === card.titleId}
                  isDescSelected={selectedElement === card.descId}
                  onSelect={handleElementSelect}
                  currentStyles={currentStyles}
                />
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Panel lateral de edición */}
      <EditPanel 
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        onStyleChange={handleStyleChange}
        selectedElement={selectedElementName}
        onApplyToAll={handleApplyToAll}
      />
    </div>
  );
}
