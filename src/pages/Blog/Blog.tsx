import { useEffect, useMemo, useState } from "react";
import { blogService } from "../../services/blog";
import { sitioService } from "../../services/sitio";
import type { BlogPost, BlogPostCreate, BlogPostUpdate, PostStatus } from "../../models/blog";
import type { Sitio } from "../../models/sitio";
import "./Blog.css";

type BlogFormState = {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: PostStatus;
  published_at: string;
  category_id: string;
  meta_title: string;
  meta_description: string;
};

const initialForm: BlogFormState = {
  title: "",
  content: "",
  excerpt: "",
  featured_image: "",
  status: "draft",
  published_at: "",
  category_id: "",
  meta_title: "",
  meta_description: "",
};

const statusLabels: Record<PostStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  scheduled: "Programado",
  archived: "Archivado",
};

export default function Blog() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingSitios, setLoadingSitios] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);

  const selectedSite = sitios.find((sitio) => sitio.id === selectedSiteId) || null;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      /* v8 ignore next */
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        /* v8 ignore next */
        (post.excerpt || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  useEffect(() => {
    loadSitios();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      loadPosts(selectedSiteId);
    } else {
      setPosts([]);
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
      setError(err instanceof Error ? err.message : "Error al cargar los sitios");
    } finally {
      setLoadingSitios(false);
    }
  }

  async function loadPosts(siteId: number) {
    setLoadingPosts(true);
    setError(null);

    try {
      const data = await blogService.getPosts(siteId);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los posts");
    } finally {
      setLoadingPosts(false);
    }
  }

  function openCreateForm() {
    setEditingPost(null);
    setForm(initialForm);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  }

  function openEditForm(post: BlogPost) {
    setEditingPost(post);
    /* v8 ignore start */
    setForm({
      title: post.title || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      featured_image: post.featured_image || "",
      status: post.status || "draft",
      published_at: post.published_at ? post.published_at.slice(0, 16) : "",
      category_id: post.category_id ? String(post.category_id) : "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
    });
    /* v8 ignore start */
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingPost(null);
    setForm(initialForm);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    /* v8 ignore next 3 */
    if (!selectedSiteId) {
      setError("Primero selecciona un sitio");
      return;
    }

    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const response = await blogService.uploadImage(selectedSiteId, file);

      setForm((prev) => ({
        ...prev,
        featured_image: response.url,
      }));

      setSuccess("Imagen subida correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  }

  function buildPayload(): BlogPostCreate | BlogPostUpdate {
    return {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim() || undefined,
      featured_image: form.featured_image.trim() || undefined,
      status: form.status,
      published_at: form.published_at
  ? new Date(form.published_at).toISOString()
  : undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
      meta_title: form.meta_title.trim() || undefined,
      meta_description: form.meta_description.trim() || undefined,
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    /* v8 ignore next 4 */
    if (!selectedSiteId) {
      setError("Selecciona un sitio antes de guardar");
      return;
    }
    /* v8 ignore stop */
    if (!form.title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (!form.content.trim()) {
      setError("El contenido es obligatorio");
      return;
    }
    if (form.status === "scheduled" && !form.published_at) {
    setError("Para programar un post debes indicar fecha y hora de publicación");
    return;
}

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = buildPayload();

      if (editingPost) {
        await blogService.updatePost(selectedSiteId, editingPost.id, payload);
        setSuccess("Post actualizado correctamente");
      } else {
        await blogService.createPost(selectedSiteId, payload as BlogPostCreate);
        setSuccess("Post creado correctamente");
      }

      await loadPosts(selectedSiteId);
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: BlogPost) {
    /* v8 ignore next */
    if (!selectedSiteId) return;

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${post.title}"?`);

    if (!confirmDelete) return;

    setError(null);
    setSuccess(null);

    try {
      await blogService.deletePost(selectedSiteId, post.id);
      setSuccess("Post eliminado correctamente");
      await loadPosts(selectedSiteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar el post");
    }
  }

  async function quickChangeStatus(post: BlogPost, status: PostStatus) {
    /* v8 ignore next */
    if (!selectedSiteId) return;

    setError(null);
    setSuccess(null);

    try {
      await blogService.updatePost(selectedSiteId, post.id, {
        status,
        /* v8 ignore start */
        published_at:
          status === "published" && !post.published_at
            ? new Date().toISOString()
            : post.published_at || undefined,
        /* v8 ignore stop */
      });

      setSuccess(`Post marcado como ${statusLabels[status].toLowerCase()}`);
      await loadPosts(selectedSiteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar el estado");
    }
  }

  function getPublicPostUrl(post: BlogPost) {
    /* v8 ignore next */
    if (!selectedSite) return "#";

    return `http://localhost:8000/${selectedSite.slug}?post=${post.slug}`;
  }

  return (
    <div className="blog-admin-page">
      <header className="blog-admin-header">
        <div>
          <span className="blog-admin-kicker">Módulo Blog</span>
          <h1>Administración visual del Blog</h1>
          <p>
            Crea, edita, publica y administra los artículos que luego se mostrarán en los
            bloques Blog del sitio publicado.
          </p>
        </div>

        <button className="blog-primary-btn" onClick={openCreateForm} disabled={!selectedSiteId}>
          + Nuevo post
        </button>
      </header>

      {error && <div className="blog-alert blog-alert-error">{error}</div>}
      {success && <div className="blog-alert blog-alert-success">{success}</div>}

      <section className="blog-toolbar">
        <div className="blog-field">
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

        <div className="blog-field">
          <label>Buscar</label>
          <input
            type="search"
            placeholder="Buscar por título o resumen..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="blog-field">
          <label>Estado</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | PostStatus)}
          >
            <option value="all">Todos</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Programado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </section>

      {!selectedSiteId && (
        <div className="blog-empty-state">
          Selecciona un sitio para administrar sus publicaciones.
        </div>
      )}

      {selectedSiteId && (
        <section className="blog-content-layout">
          <div className="blog-posts-panel">
            <div className="blog-panel-title">
              <h2>Publicaciones</h2>
              <span>{filteredPosts.length} resultado(s)</span>
            </div>

            {loadingPosts ? (
              <div className="blog-empty-state">Cargando posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="blog-empty-state">
                No hay publicaciones. Crea tu primer post para este sitio.
              </div>
            ) : (
              <div className="blog-posts-grid">
                {filteredPosts.map((post) => (
                  <article className="blog-post-card" key={post.id}>
                    <div className="blog-post-image">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.title} />
                      ) : (
                        <div className="blog-post-placeholder">Blog</div>
                      )}
                    </div>

                    <div className="blog-post-body">
                      <div className="blog-post-meta">
                        <span className={`blog-status blog-status-${post.status}`}>
                          {statusLabels[post.status]}
                        </span>
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "Sin fecha"}</span>
                      </div>

                      <h3>{post.title}</h3>

                      <p>
                        {post.excerpt ||
                          post.meta_description ||
                          post.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..."}
                      </p>

                      <div className="blog-post-actions">
                        <button onClick={() => openEditForm(post)}>Editar</button>

                        {post.status !== "published" && (
                          <button onClick={() => quickChangeStatus(post, "published")}>
                            Publicar
                          </button>
                        )}

                        {post.status !== "draft" && (
                          <button onClick={() => quickChangeStatus(post, "draft")}>
                            Borrador
                          </button>
                        )}

                        <a href={getPublicPostUrl(post)} target="_blank" rel="noreferrer">
                          Ver
                        </a>

                        <button className="blog-danger-btn" onClick={() => handleDelete(post)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {isFormOpen && (
            <aside className="blog-form-panel">
              <div className="blog-form-header">
                <h2>{editingPost ? "Editar post" : "Nuevo post"}</h2>
                <button onClick={closeForm}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="blog-form">
                <div className="blog-field">
                  <label>Título *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ej: Mi primer artículo"
                  />
                </div>

                <div className="blog-field">
                  <label>Resumen</label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Breve descripción del artículo..."
                  />
                </div>

                <div className="blog-field">
                  <label>Contenido *</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={10}
                    placeholder="<p>Escribe el contenido del artículo...</p>"
                  />
                  <small>Puedes escribir HTML básico como &lt;p&gt;, &lt;strong&gt;, &lt;h2&gt;.</small>
                </div>

                <div className="blog-field">
                  <label>Imagen destacada</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {uploadingImage && <small>Subiendo imagen...</small>}
                  {form.featured_image && (
                    <div className="blog-image-preview">
                      <img src={form.featured_image} alt="Vista previa" />
                      <input
                        name="featured_image"
                        value={form.featured_image}
                        onChange={handleChange}
                        placeholder="URL de imagen"
                      />
                    </div>
                  )}
                </div>

                <div className="blog-form-row">
                  <div className="blog-field">
                    <label>Estado</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="scheduled">Programado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>

                  <div className="blog-field">
                    <label>Fecha publicación</label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      value={form.published_at}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="blog-field">
                  <label>Meta título SEO</label>
                  <input
                    name="meta_title"
                    value={form.meta_title}
                    onChange={handleChange}
                    placeholder="Título para buscadores"
                  />
                </div>

                <div className="blog-field">
                  <label>Meta descripción SEO</label>
                  <textarea
                    name="meta_description"
                    value={form.meta_description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción para buscadores"
                  />
                </div>

                <div className="blog-form-actions">
                  <button type="button" onClick={closeForm} className="blog-secondary-btn">
                    Cancelar
                  </button>

                  <button type="submit" className="blog-primary-btn" disabled={saving}>
                    {saving ? "Guardando..." : editingPost ? "Actualizar" : "Crear post"}
                  </button>
                </div>
              </form>
            </aside>
          )}
        </section>
      )}
    </div>
  );
}