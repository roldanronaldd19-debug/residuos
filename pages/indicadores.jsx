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

export default function Indicadores() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newValue) => {
    console.log("Texto guardado:", newValue);
  };

  const cardData = [
    {
      title: "Indicadores de Generación",
      description: "Monitorea la cantidad de residuos generados por área y período",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Indicadores de Separación",
      description: "Evalúa la efectividad en la separación de residuos reciclables",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div>
      <Navbar onToggleEdit={setIsEditing} />
      <main className="max-w-6xl mx-auto mt-10 p-6">
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Indicadores de Gestión</h1>
          <p className="text-lg text-gray-600">
            Sigue los principales indicadores de desempeño en la gestión de residuos sólidos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardData.map((card, index) => (
            <EditableCard
              key={index}
              title={card.title}
              description={card.description}
              bgColor={card.bgColor}
              borderColor={card.borderColor}
              isEditing={isEditing}
              onSave={handleSave}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
