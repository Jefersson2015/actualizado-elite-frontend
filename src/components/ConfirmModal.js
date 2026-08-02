import React from 'react';
import '../styles/ConfirmModal.css';

/**
 * Modal de confirmación reutilizable.
 * A diferencia del Toast, este SÍ bloquea la pantalla a propósito,
 * porque se usa para acciones irreversibles (como vaciar el carrito).
 *
 * Props:
 * - visible: boolean -> si es true, se muestra el modal
 * - titulo: string -> título del modal (opcional)
 * - mensaje: string -> el texto de la pregunta
 * - onConfirm: función que se ejecuta si el usuario da "Aceptar"
 * - onCancel: función que se ejecuta si el usuario da "Cancelar"
 */
function ConfirmModal({ visible, titulo = 'Confirmar acción', mensaje, onConfirm, onCancel }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3 className="confirm-titulo">{titulo}</h3>
        <p className="confirm-mensaje">{mensaje}</p>
        <div className="confirm-botones">
          <button className="confirm-btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-btn-aceptar" onClick={onConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;