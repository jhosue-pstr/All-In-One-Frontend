import type { ReactNode } from 'react'

interface ModalDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly testId?: string
  readonly children: ReactNode
}

export function ModalDialog({ isOpen, onClose, testId, children }: ModalDialogProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          background: 'transparent', border: 'none', padding: 0, cursor: 'default',
        }}
      />
      <dialog
        className="modal modal-lg"
        aria-labelledby="modal-title"
        open
        style={{ position: 'relative', zIndex: 1 }}
        data-testid={testId}
      >
        {children}
      </dialog>
    </div>
  )
}
