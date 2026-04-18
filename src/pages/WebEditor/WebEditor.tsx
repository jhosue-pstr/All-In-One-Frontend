import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './WebEditor.css';

export function WebEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="web-editor-simple">
      <div className="editor-header">
        <button onClick={() => navigate('/plantillas')}>← Volver</button>
        <span>Editor de Plantilla (ID: {id})</span>
        <button className="btn-primary">Guardar</button>
      </div>
      <div className="editor-content">
        <h1>Página para editar</h1>
        <p>Editor de plantillas en construcción...</p>
      </div>
    </div>
  );
}