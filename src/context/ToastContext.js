import React, { createContext, useContext, useState, useCallback } from 'react';

// Este contexto permite que CUALQUIER componente de la app
// pueda mostrar una notificación tipo "toast" sin bloquear la pantalla,
// simplemente llamando a la función showToast("mensaje").
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  // toast guarda el mensaje actual y el tipo (success, error, info)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });

    // Después de 3 segundos, el toast desaparece solo
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook para usar fácilmente el toast desde cualquier componente:
// const { showToast } = useToast();
// showToast("Producto agregado al carrito");
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un <ToastProvider>');
  }
  return context;
}