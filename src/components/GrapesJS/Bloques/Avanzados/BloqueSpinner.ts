export const BloqueSpinner = {
  id: 'bloque-spinner',
  label: 'Spinner / Cargando',
  attributes: {
    class: 'fa fa-spinner fa-spin',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="spinner-container" style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; gap: 15px;">
  <!-- Circular Spinner -->
  <div class="spinner" style="width: 50px; height: 50px; border: 4px solid #e9ecef; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite;"></div>

  <!-- Dots Spinner -->
  <div class="dots-spinner" style="display: flex; gap: 8px;">
    <span style="width: 12px; height: 12px; background: #0066cc; border-radius: 50%; animation: bounce 1.4s ease-in-out infinite both;"></span>
    <span style="width: 12px; height: 12px; background: #0066cc; border-radius: 50%; animation: bounce 1.4s ease-in-out 0.16s infinite both;"></span>
    <span style="width: 12px; height: 12px; background: #0066cc; border-radius: 50%; animation: bounce 1.4s ease-in-out 0.32s infinite both;"></span>
  </div>

  <!-- Pulse Spinner -->
  <div class="pulse-spinner" style="width: 50px; height: 50px; background: #0066cc; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite;"></div>

  <p style="margin: 0; font-size: 14px; color: #666;">Cargando...</p>
</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
}
</style>`
}
