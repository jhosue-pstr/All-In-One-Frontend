import { useEffect, useMemo, useState } from "react";
import { storeService } from "../../services/store";
import { sitioService } from "../../services/sitio";
import type {
  StoreProducto,
  StoreProductoCreate,
  StoreProductoUpdate,
  StoreProductoListado,
  StoreCategoria,
  StoreCategoriaCreate,
  StoreCategoriaUpdate,
  StorePedido,
  StorePedidoListado,
} from "../../models/store";
import type { Sitio } from "../../models/sitio";
import "./Tienda.css";

type TabId = "productos" | "categorias" | "pedidos";

type ProductoFormState = {
  nombre: string;
  slug: string;
  descripcion: string;
  sku: string;
  precio: string;
  precio_comparacion: string;
  costo: string;
  stock: string;
  stock_minimo: string;
  imagen_url: string;
  categoria_id: string;
  es_activo: boolean;
  es_featured: boolean;
  controlar_alertas: boolean;
};

type CategoriaFormState = {
  nombre: string;
  slug: string;
  descripcion: string;
  imagen: string;
};

const initialProductoForm: ProductoFormState = {
  nombre: "",
  slug: "",
  descripcion: "",
  sku: "",
  precio: "",
  precio_comparacion: "",
  costo: "",
  stock: "0",
  stock_minimo: "0",
  imagen_url: "",
  categoria_id: "",
  es_activo: true,
  es_featured: false,
  controlar_alertas: true,
};

const initialCategoriaForm: CategoriaFormState = {
  nombre: "",
  slug: "",
  descripcion: "",
  imagen: "",
};

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  procesando: "Procesando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}

function getFirstImage(product: StoreProductoListado | StoreProducto): string {
  const imagenes = product.imagenes;
  if (imagenes && imagenes.length > 0 && typeof imagenes[0] === "string") {
    return imagenes[0] as string;
  }
  return "";
}

export default function Tienda() {
  const [activeTab, setActiveTab] = useState<TabId>("productos");

  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  const [productos, setProductos] = useState<StoreProductoListado[]>([]);
  const [categorias, setCategorias] = useState<StoreCategoria[]>([]);
  const [pedidos, setPedidos] = useState<StorePedidoListado[]>([]);
  const [pedidoDetail, setPedidoDetail] = useState<StorePedido | null>(null);

  const [loadingSitios, setLoadingSitios] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [savingProducto, setSavingProducto] = useState(false);
  const [savingCategoria, setSavingCategoria] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [pedidoEstadoFilter, setPedidoEstadoFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<StoreProductoListado | null>(null);
  const [form, setForm] = useState<ProductoFormState>(initialProductoForm);

  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<StoreCategoria | null>(null);
  const [categoriaForm, setCategoriaForm] = useState<CategoriaFormState>(initialCategoriaForm);

  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);

  const filteredProductos = useMemo(() => {
    if (!search) return productos;
    const q = search.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [productos, search]);

  const filteredPedidos = useMemo(() => {
    if (pedidoEstadoFilter === "all") return pedidos;
    return pedidos.filter((p) => p.estado === pedidoEstadoFilter);
  }, [pedidos, pedidoEstadoFilter]);

  useEffect(() => {
    loadSitios();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      loadProductos(selectedSiteId);
      loadCategorias(selectedSiteId);
      loadPedidos(selectedSiteId);
    } else {
      setProductos([]);
      setCategorias([]);
      setPedidos([]);
    }
  }, [selectedSiteId]);

  async function loadSitios() {
    setLoadingSitios(true);
    setError(null);
    try {
      const data = await sitioService.getAll();
      setSitios(data);
      if (data.length > 0) {
        setSelectedSiteId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar sitios");
    } finally {
      setLoadingSitios(false);
    }
  }

  async function loadProductos(siteId: number) {
    setLoadingProductos(true);
    setError(null);
    try {
      const res = await storeService.getProducts(siteId, { solo_activos: false });
      setProductos(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoadingProductos(false);
    }
  }

  async function loadCategorias(siteId: number) {
    setLoadingCategorias(true);
    try {
      const res = await storeService.getCategorias(siteId, false);
      setCategorias(res.data);
    } catch {
      // silencioso
    } finally {
      setLoadingCategorias(false);
    }
  }

  async function loadPedidos(siteId: number) {
    setLoadingPedidos(true);
    try {
      const res = await storeService.getPedidos(siteId);
      setPedidos(res.data);
    } catch {
      // silencioso
    } finally {
      setLoadingPedidos(false);
    }
  }

  function openCreateForm() {
    setEditingProducto(null);
    setForm(initialProductoForm);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  }

  function openEditForm(producto: StoreProductoListado) {
    setEditingProducto(producto);
    setForm({
      nombre: producto.nombre,
      slug: producto.slug,
      descripcion: "",
      sku: "",
      precio: String(producto.precio),
      precio_comparacion: producto.precio_comparacion ? String(producto.precio_comparacion) : "",
      costo: "",
      stock: String(producto.stock),
      stock_minimo: "0",
      imagen_url: getFirstImage(producto),
      categoria_id: "",
      es_activo: producto.es_activo,
      es_featured: producto.es_featured,
      controlar_alertas: true,
    });
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingProducto(null);
    setForm(initialProductoForm);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "nombre" && !editingProducto ? { slug: slugify(value) } : {}),
      }));
    }
  }

  function buildProductoPayload(): StoreProductoCreate | StoreProductoUpdate {
    const payload: Record<string, unknown> = {
      nombre: form.nombre.trim(),
      slug: form.slug.trim() || slugify(form.nombre.trim()),
      descripcion: form.descripcion.trim() || undefined,
      sku: form.sku.trim() || undefined,
      precio: Number(form.precio),
      precio_comparacion: form.precio_comparacion ? Number(form.precio_comparacion) : undefined,
      costo: form.costo ? Number(form.costo) : undefined,
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo),
      controlar_alertas: form.controlar_alertas,
      es_activo: form.es_activo,
      es_featured: form.es_featured,
      categoria_id: form.categoria_id ? Number(form.categoria_id) : undefined,
    };

    if (form.imagen_url) {
      payload.imagenes = [form.imagen_url];
    }

    return payload as unknown as StoreProductoCreate;
  }

  async function handleProductoSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedSiteId) {
      setError("Selecciona un sitio antes de guardar");
      return;
    }

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!form.precio || Number(form.precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    setSavingProducto(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = buildProductoPayload();

      if (editingProducto) {
        await storeService.updateProduct(selectedSiteId, editingProducto.id, payload);
        setSuccess("Producto actualizado correctamente");
      } else {
        await storeService.createProduct(selectedSiteId, payload as StoreProductoCreate);
        setSuccess("Producto creado correctamente");
      }

      await loadProductos(selectedSiteId);
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar producto");
    } finally {
      setSavingProducto(false);
    }
  }

  async function handleDeleteProducto(producto: StoreProductoListado) {
    if (!selectedSiteId) return;

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`);
    if (!confirmDelete) return;

    setError(null);
    setSuccess(null);

    try {
      await storeService.deleteProduct(selectedSiteId, producto.id);
      setSuccess("Producto eliminado correctamente");
      await loadProductos(selectedSiteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar producto");
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedSiteId) {
      setError("Primero selecciona un sitio");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/v1/sitios/${selectedSiteId}/tienda/upload-image`,
        { method: "POST", body: formData }
      );
      const json = await response.json();
      const url = json.url || json.image_url || "";
      if (url) {
        setForm((prev) => ({ ...prev, imagen_url: url }));
        setSuccess("Imagen subida correctamente");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploadingImage(false);
    }
  }

  function openCreateCategoria() {
    setEditingCategoria(null);
    setCategoriaForm(initialCategoriaForm);
    setIsCategoriaModalOpen(true);
  }

  function openEditCategoria(cat: StoreCategoria) {
    setEditingCategoria(cat);
    setCategoriaForm({
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion || "",
      imagen: cat.imagen || "",
    });
    setIsCategoriaModalOpen(true);
  }

  function closeCategoriaModal() {
    setIsCategoriaModalOpen(false);
    setEditingCategoria(null);
    setCategoriaForm(initialCategoriaForm);
  }

  function handleCategoriaChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setCategoriaForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "nombre" && !editingCategoria ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleCategoriaSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedSiteId) return;

    if (!categoriaForm.nombre.trim()) {
      setError("El nombre de la categoría es obligatorio");
      return;
    }

    setSavingCategoria(true);
    setError(null);
    setSuccess(null);

    try {
      const data: StoreCategoriaCreate | StoreCategoriaUpdate = {
        nombre: categoriaForm.nombre.trim(),
        slug: categoriaForm.slug.trim() || slugify(categoriaForm.nombre.trim()),
        descripcion: categoriaForm.descripcion.trim() || undefined,
        imagen: categoriaForm.imagen.trim() || undefined,
      };

      if (editingCategoria) {
        await storeService.updateCategoria(selectedSiteId, editingCategoria.id, data);
        setSuccess("Categoría actualizada correctamente");
      } else {
        await storeService.createCategoria(selectedSiteId, data as StoreCategoriaCreate);
        setSuccess("Categoría creada correctamente");
      }

      await loadCategorias(selectedSiteId);
      closeCategoriaModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar categoría");
    } finally {
      setSavingCategoria(false);
    }
  }

  async function handleDeleteCategoria(cat: StoreCategoria) {
    if (!selectedSiteId) return;

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${cat.nombre}"?`);
    if (!confirmDelete) return;

    try {
      await storeService.deleteCategoria(selectedSiteId, cat.id);
      setSuccess("Categoría eliminada correctamente");
      await loadCategorias(selectedSiteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar categoría");
    }
  }

  async function openPedidoDetail(pedido: StorePedidoListado) {
    if (!selectedSiteId) return;
    try {
      const detail = await storeService.getPedido(selectedSiteId, pedido.id);
      setPedidoDetail(detail);
      setIsPedidoModalOpen(true);
    } catch {
      setError("Error al cargar detalle del pedido");
    }
  }

  async function handleCambiarEstadoPedido(pedidoId: number, nuevoEstado: string) {
    if (!selectedSiteId) return;
    try {
      await storeService.updatePedidoEstado(selectedSiteId, pedidoId, { estado: nuevoEstado });
      setSuccess(`Pedido actualizado a "${estadoLabels[nuevoEstado] || nuevoEstado}"`);
      await loadPedidos(selectedSiteId);
      if (pedidoDetail && pedidoDetail.id === pedidoId) {
        const updated = await storeService.getPedido(selectedSiteId, pedidoId);
        setPedidoDetail(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar pedido");
    }
  }

  return (
    <div className="tienda-admin-page">
      <header className="tienda-admin-header">
        <div>
          <span className="tienda-admin-kicker">Módulo Tienda</span>
          <h1>Administración de Tienda</h1>
          <p>
            Gestiona productos, categorías y pedidos de tu tienda online.
          </p>
        </div>
      </header>

      {error && <div className="tienda-alert tienda-alert-error">{error}</div>}
      {success && <div className="tienda-alert tienda-alert-success">{success}</div>}

      <section className="tienda-toolbar">
        <div className="tienda-field">
          <label>Sitio</label>
          <select
            value={selectedSiteId || ""}
            onChange={(event) => setSelectedSiteId(Number(event.target.value))}
            disabled={loadingSitios}
          >
            <option value="">Selecciona un sitio</option>
            {sitios.map((sitio) => (
              <option key={sitio.id} value={sitio.id}>
                {sitio.nombre}
              </option>
            ))}
          </select>
        </div>
      </section>

      <nav className="tienda-tabs">
        <button
          className={`tienda-tab ${activeTab === "productos" ? "active" : ""}`}
          onClick={() => setActiveTab("productos")}
        >
          Productos
        </button>
        <button
          className={`tienda-tab ${activeTab === "categorias" ? "active" : ""}`}
          onClick={() => setActiveTab("categorias")}
        >
          Categorías
        </button>
        <button
          className={`tienda-tab ${activeTab === "pedidos" ? "active" : ""}`}
          onClick={() => setActiveTab("pedidos")}
        >
          Pedidos
        </button>
      </nav>

      {!selectedSiteId && (
        <div className="tienda-empty-state">
          Selecciona un sitio para administrar su tienda.
        </div>
      )}

      {selectedSiteId && activeTab === "productos" && (
        <section className="tienda-content-layout">
          <div className="tienda-list-panel">
            <div className="tienda-panel-title">
              <h2>Productos</h2>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span>{filteredProductos.length} resultado(s)</span>
                <button className="tienda-primary-btn" onClick={openCreateForm}>
                  + Nuevo producto
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <input
                type="search"
                placeholder="Buscar productos..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {loadingProductos ? (
              <div className="tienda-empty-state">Cargando productos...</div>
            ) : filteredProductos.length === 0 ? (
              <div className="tienda-empty-state">
                No hay productos. Crea tu primer producto para este sitio.
              </div>
            ) : (
              <div className="tienda-grid">
                {filteredProductos.map((producto) => {
                  const imgUrl = getFirstImage(producto);
                  return (
                    <article className="tienda-card" key={producto.id}>
                      <div className="tienda-card-image">
                        {imgUrl ? (
                          <img src={imgUrl} alt={producto.nombre} />
                        ) : (
                          <div className="tienda-card-placeholder">Producto</div>
                        )}
                        {producto.es_featured && (
                          <span className="tienda-card-badge tienda-card-badge-featured">
                            Destacado
                          </span>
                        )}
                        {!producto.es_activo && (
                          <span
                            className="tienda-card-badge tienda-card-badge-inactive"
                            style={{ left: "auto", right: "10px" }}
                          >
                            Inactivo
                          </span>
                        )}
                      </div>

                      <div className="tienda-card-body">
                        <div className="tienda-card-meta">
                          <span>Stock: {producto.stock}</span>
                        </div>
                        <h3>{producto.nombre}</h3>
                        <div className="tienda-card-price">
                          {formatPrice(producto.precio)}
                        </div>

                        <div className="tienda-card-actions">
                          <button onClick={() => openEditForm(producto)}>Editar</button>
                          <button
                            className="tienda-danger-btn"
                            onClick={() => handleDeleteProducto(producto)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {isFormOpen && (
            <aside className="tienda-form-panel">
              <div className="tienda-form-header">
                <h2>{editingProducto ? "Editar producto" : "Nuevo producto"}</h2>
                <button onClick={closeForm}>×</button>
              </div>

              <form onSubmit={handleProductoSubmit} className="tienda-form">
                <div className="tienda-field">
                  <label>Nombre *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Camiseta de algodón"
                  />
                </div>

                <div className="tienda-field">
                  <label>Slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="camiseta-de-algodon"
                  />
                  <small>Se genera automáticamente desde el nombre.</small>
                </div>

                <div className="tienda-field">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción del producto..."
                  />
                </div>

                <div className="tienda-field">
                  <label>SKU</label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="Ej: CAM-001"
                  />
                </div>

                <div className="tienda-form-row">
                  <div className="tienda-field">
                    <label>Precio * (S/)</label>
                    <input
                      name="precio"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.precio}
                      onChange={handleChange}
                      placeholder="99.90"
                    />
                  </div>

                  <div className="tienda-field">
                    <label>Precio comparación (S/)</label>
                    <input
                      name="precio_comparacion"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.precio_comparacion}
                      onChange={handleChange}
                      placeholder="129.90"
                    />
                  </div>
                </div>

                <div className="tienda-form-row-3">
                  <div className="tienda-field">
                    <label>Costo (S/)</label>
                    <input
                      name="costo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.costo}
                      onChange={handleChange}
                      placeholder="45.00"
                    />
                  </div>

                  <div className="tienda-field">
                    <label>Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="tienda-field">
                    <label>Stock mínimo</label>
                    <input
                      name="stock_minimo"
                      type="number"
                      min="0"
                      value={form.stock_minimo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="tienda-field">
                  <label>Categoría</label>
                  <select
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={handleChange}
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="tienda-field">
                  <label>Imagen</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {uploadingImage && <small>Subiendo imagen...</small>}
                  <input
                    name="imagen_url"
                    value={form.imagen_url}
                    onChange={handleChange}
                    placeholder="URL de imagen"
                  />
                  {form.imagen_url && (
                    <div className="tienda-image-preview">
                      <img src={form.imagen_url} alt="Vista previa" />
                    </div>
                  )}
                </div>

                <div className="tienda-checkbox-row">
                  <label>
                    <input
                      type="checkbox"
                      name="es_activo"
                      checked={form.es_activo}
                      onChange={handleChange}
                    />
                    Activo
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="es_featured"
                      checked={form.es_featured}
                      onChange={handleChange}
                    />
                    Destacado
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="controlar_alertas"
                      checked={form.controlar_alertas}
                      onChange={handleChange}
                    />
                    Alertas stock
                  </label>
                </div>

                <div className="tienda-form-actions">
                  <button type="button" onClick={closeForm} className="tienda-secondary-btn">
                    Cancelar
                  </button>
                  <button type="submit" className="tienda-primary-btn" disabled={savingProducto}>
                    {savingProducto
                      ? "Guardando..."
                      : editingProducto
                        ? "Actualizar"
                        : "Crear producto"}
                  </button>
                </div>
              </form>
            </aside>
          )}
        </section>
      )}

      {selectedSiteId && activeTab === "categorias" && (
        <section className="tienda-list-panel">
          <div className="tienda-panel-title">
            <h2>Categorías</h2>
            <button className="tienda-primary-btn" onClick={openCreateCategoria}>
              + Nueva categoría
            </button>
          </div>

          {loadingCategorias ? (
            <div className="tienda-empty-state">Cargando categorías...</div>
          ) : categorias.length === 0 ? (
            <div className="tienda-empty-state">
              No hay categorías. Crea la primera categoría para organizar tus productos.
            </div>
          ) : (
            <div className="tienda-categoria-list">
              {categorias.map((cat) => (
                <div className="tienda-categoria-item" key={cat.id}>
                  <div className="tienda-categoria-info">
                    <span className="tienda-categoria-name">
                      {cat.nombre}
                      {!cat.activa && (
                        <span style={{ color: "#ef4444", fontSize: "12px", marginLeft: "8px" }}>
                          (inactiva)
                        </span>
                      )}
                    </span>
                    <span className="tienda-categoria-slug">/{cat.slug}</span>
                  </div>
                  <div className="tienda-categoria-actions">
                    <button onClick={() => openEditCategoria(cat)}>Editar</button>
                    <button
                      style={{ background: "#fee2e2", color: "#991b1b" }}
                      onClick={() => handleDeleteCategoria(cat)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isCategoriaModalOpen && (
            <div className="tienda-modal-overlay" onClick={closeCategoriaModal}>
              <div className="tienda-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tienda-modal-header">
                  <h2>{editingCategoria ? "Editar categoría" : "Nueva categoría"}</h2>
                  <button onClick={closeCategoriaModal}>×</button>
                </div>

                <form onSubmit={handleCategoriaSubmit}>
                  <div className="tienda-modal-body">
                    <div className="tienda-field">
                      <label>Nombre *</label>
                      <input
                        name="nombre"
                        value={categoriaForm.nombre}
                        onChange={handleCategoriaChange}
                        placeholder="Ej: Ropa"
                      />
                    </div>

                    <div className="tienda-field">
                      <label>Slug</label>
                      <input
                        name="slug"
                        value={categoriaForm.slug}
                        onChange={handleCategoriaChange}
                        placeholder="ropa"
                      />
                    </div>

                    <div className="tienda-field">
                      <label>Descripción</label>
                      <textarea
                        name="descripcion"
                        value={categoriaForm.descripcion}
                        onChange={handleCategoriaChange}
                        rows={2}
                        placeholder="Descripción de la categoría..."
                      />
                    </div>

                    <div className="tienda-field">
                      <label>Imagen (URL)</label>
                      <input
                        name="imagen"
                        value={categoriaForm.imagen}
                        onChange={handleCategoriaChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>

                  <div className="tienda-modal-actions">
                    <button
                      type="button"
                      className="tienda-secondary-btn"
                      onClick={closeCategoriaModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="tienda-primary-btn" disabled={savingCategoria}>
                      {savingCategoria
                        ? "Guardando..."
                        : editingCategoria
                          ? "Actualizar"
                          : "Crear categoría"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {selectedSiteId && activeTab === "pedidos" && (
        <section className="tienda-list-panel">
          <div className="tienda-panel-title">
            <h2>Pedidos</h2>
            <span>{filteredPedidos.length} resultado(s)</span>
          </div>

          <div className="tienda-toolbar-left">
            <div className="tienda-field">
              <label>Filtrar por estado</label>
              <select
                value={pedidoEstadoFilter}
                onChange={(event) => setPedidoEstadoFilter(event.target.value)}
              >
                <option value="all">Todos</option>
                {Object.entries(estadoLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingPedidos ? (
            <div className="tienda-empty-state">Cargando pedidos...</div>
          ) : filteredPedidos.length === 0 ? (
            <div className="tienda-empty-state">
              {pedidoEstadoFilter === "all"
                ? "No hay pedidos todavía."
                : "No hay pedidos con este estado."}
            </div>
          ) : (
            <table className="tienda-table">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Pago</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td style={{ fontWeight: 700 }}>{pedido.numero_pedido}</td>
                    <td>{pedido.nombre_cliente}</td>
                    <td>{pedido.email_cliente}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(pedido.total)}</td>
                    <td>
                      <span className={`tienda-status tienda-status-${pedido.estado}`}>
                        {estadoLabels[pedido.estado] || pedido.estado}
                      </span>
                    </td>
                    <td>{pedido.estado_pago}</td>
                    <td>{new Date(pedido.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => openPedidoDetail(pedido)}>Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isPedidoModalOpen && pedidoDetail && (
            <div className="tienda-modal-overlay" onClick={() => setIsPedidoModalOpen(false)}>
              <div
                className="tienda-modal"
                style={{ width: "min(700px, 100%)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="tienda-modal-header">
                  <h2>Pedido {pedidoDetail.numero_pedido}</h2>
                  <button onClick={() => setIsPedidoModalOpen(false)}>×</button>
                </div>

                <div className="tienda-modal-body">
                  <div className="tienda-pedido-detail-grid">
                    <div className="tienda-pedido-detail-item">
                      <h4>Cliente</h4>
                      <p>{pedidoDetail.nombre_cliente}</p>
                    </div>
                    <div className="tienda-pedido-detail-item">
                      <h4>Email</h4>
                      <p>{pedidoDetail.email_cliente}</p>
                    </div>
                    {pedidoDetail.telefono_cliente && (
                      <div className="tienda-pedido-detail-item">
                        <h4>Teléfono</h4>
                        <p>{pedidoDetail.telefono_cliente}</p>
                      </div>
                    )}
                    <div className="tienda-pedido-detail-item">
                      <h4>Estado</h4>
                      <p>
                        <span
                          className={`tienda-status tienda-status-${pedidoDetail.estado}`}
                        >
                          {estadoLabels[pedidoDetail.estado] || pedidoDetail.estado}
                        </span>
                      </p>
                    </div>
                    <div className="tienda-pedido-detail-item">
                      <h4>Método de pago</h4>
                      <p>{pedidoDetail.metodo_pago || "—"}</p>
                    </div>
                    <div className="tienda-pedido-detail-item">
                      <h4>Estado del pago</h4>
                      <p>{pedidoDetail.estado_pago}</p>
                    </div>
                  </div>

                  {(pedidoDetail.direccion_envio ||
                    pedidoDetail.ciudad_envio ||
                    pedidoDetail.pais_envio) && (
                    <div style={{ marginTop: "12px" }}>
                      <h4 style={{ margin: "0 0 6px", fontSize: "12px", color: "#64748b" }}>
                        DIRECCIÓN DE ENVÍO
                      </h4>
                      <p style={{ margin: 0, color: "#0f172a", fontSize: "14px" }}>
                        {[pedidoDetail.direccion_envio, pedidoDetail.ciudad_envio, pedidoDetail.pais_envio]
                          .filter(Boolean)
                          .join(", ")}
                        {pedidoDetail.codigo_postal && ` - ${pedidoDetail.codigo_postal}`}
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: "12px" }}>
                    <h4 style={{ margin: "0 0 8px", fontSize: "12px", color: "#64748b" }}>
                      ITEMS DEL PEDIDO
                    </h4>
                    <table className="tienda-pedido-items-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>SKU</th>
                          <th>Cantidad</th>
                          <th>Precio unit.</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidoDetail.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombre_producto}</td>
                            <td>{item.sku_producto || "—"}</td>
                            <td>{item.cantidad}</td>
                            <td>{formatPrice(item.precio_unitario)}</td>
                            <td style={{ fontWeight: 700 }}>{formatPrice(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "12px",
                      padding: "16px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                        Cambiar estado
                      </h4>
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                        {Object.entries(estadoLabels).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleCambiarEstadoPedido(pedidoDetail.id, key)}
                            disabled={key === pedidoDetail.estado}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              background: key === pedidoDetail.estado ? "#2563eb" : "white",
                              color: key === pedidoDetail.estado ? "white" : "#334155",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>Total</div>
                      <div style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a" }}>
                        {formatPrice(pedidoDetail.total)}
                      </div>
                    </div>
                  </div>

                  {pedidoDetail.notas && (
                    <div style={{ marginTop: "12px" }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: "12px", color: "#64748b" }}>
                        NOTAS DEL PEDIDO
                      </h4>
                      <p style={{ margin: 0, color: "#0f172a", fontSize: "14px" }}>
                        {pedidoDetail.notas}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
