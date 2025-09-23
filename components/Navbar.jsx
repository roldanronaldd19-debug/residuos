'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LoginModal from "./LoginModal";
import Link from "next/link";

export default function Navbar({ onToggleEdit }) {
  const [session, setSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsEditing(false);
    onToggleEdit(false);
  };

  const toggleEdit = () => {
    const newState = !isEditing;
    setIsEditing(newState);
    onToggleEdit(newState);
  };

  if (!mounted) {
    return (
      <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Sistema de Residuos</div>
        <div className="bg-gray-600 px-4 py-2 rounded animate-pulse">Cargando...</div>
      </nav>
    );
  }

  return (
    <>
      <div className={isEditing ? 'edit-mode-active' : ''}>
        <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center relative">
          <div className="text-xl font-bold">Sistema de Residuos</div>
          
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
            <li><Link href="/indicadores" className="hover:text-blue-400 transition-colors">Indicadores</Link></li>
            <li><Link href="/metas" className="hover:text-blue-400 transition-colors">Metas</Link></li>
            <li><Link href="/avances" className="hover:text-blue-400 transition-colors">Avances</Link></li>
            <li><Link href="/reportes" className="hover:text-blue-400 transition-colors">Reportes</Link></li>
            <li><Link href="/formularios" className="hover:text-blue-400 transition-colors">Formularios</Link></li>
          </ul>
          
          <div>
            {!session ? (
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{session.user.email}</span>
                <button 
                  onClick={toggleEdit} 
                  className={`px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 font-semibold ${
                    isEditing 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isEditing ? "Salir de Edición" : "✎ Modo Edición"}
                </button>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded transition-all duration-300 transform hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
