import { useEffect, useRef } from "react";

export function DeleteRosterDialog({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    cancel.current?.focus();
    return () => { element.close(); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);
  return <dialog ref={dialog} className="admin-delete-dialog" aria-labelledby="admin-delete-title" aria-describedby="admin-delete-description" onCancel={event => { event.preventDefault(); onCancel(); }}>
    <h2 id="admin-delete-title">Eliminar registro</h2>
    <p id="admin-delete-description">¿Eliminar a «{name}» de esta demostración? Se eliminará únicamente este registro.</p>
    <div className="admin-dialog-actions">
      <button ref={cancel} type="button" className="button button-secondary" onClick={onCancel}>Cancelar</button>
      <button type="button" className="button admin-delete-confirm" onClick={onConfirm}>Eliminar registro</button>
    </div>
  </dialog>;
}
