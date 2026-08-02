import React from 'react';
import { useToast } from '../context/ToastContext';
import '../styles/Toast.css';

// Este componente se coloca UNA sola vez en App.js.
// Se muestra automáticamente cada vez que algún componente
// llama a showToast(), y desaparece solo sin bloquear la pantalla.
function Toast() {
  const { toast } = useToast();

  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.tipo}`}>
      {toast.mensaje}
    </div>
  );
}

export default Toast;