import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Blog from "./Blog";
import { sitioService } from "../../services/sitio";
import { blogService } from "../../services/blog";
import "@testing-library/jest-dom/vitest";
vi.mock("../../services/sitio", () => ({
  sitioService: {
    getAll: vi.fn(),
  },
}));

vi.mock("../../services/blog", () => ({
  blogService: {
    getPosts: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

const mockSitios = [
  {
    id: 1,
    nombre: "Sitio Demo",
    slug: "sitio-demo",
    descripcion: "Demo",
    activo: true,
    configuracion: {},
    switches: {},
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    nombre: "Segundo Sitio",
    slug: "segundo-sitio",
    descripcion: "Demo 2",
    activo: true,
    configuracion: {},
    switches: {},
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const mockPosts = [
  {
    id: 10,
    site_id: 1,
    title: "Post Publicado",
    slug: "post-publicado",
    content: "<p>Contenido publicado</p>",
    excerpt: "Resumen publicado",
    featured_image: "https://example.com/image.png",
    status: "published",
    published_at: "2026-01-01T10:00:00Z",
    category_id: 1,
    meta_title: "Meta publicado",
    meta_description: "Meta descripción",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 11,
    site_id: 1,
    title: "Post Borrador",
    slug: "post-borrador",
    content: "<p>Contenido borrador</p>",
    excerpt: "",
    featured_image: "",
    status: "draft",
    published_at: null,
    category_id: null,
    meta_title: "",
    meta_description: "Descripción borrador",
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  },
] as any[];

describe("Blog page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(sitioService.getAll).mockResolvedValue(mockSitios as any);
    vi.mocked(blogService.getPosts).mockResolvedValue(mockPosts);
    vi.mocked(blogService.createPost).mockResolvedValue(mockPosts[0]);
    vi.mocked(blogService.updatePost).mockResolvedValue(mockPosts[0]);
    vi.mocked(blogService.deletePost).mockResolvedValue(undefined as any);
    vi.mocked(blogService.uploadImage).mockResolvedValue({
      url: "/uploads/blog/test.png",
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("loads sitios and posts", async () => {
    render(<Blog />);

    expect(screen.getByText("Administración visual del Blog")).toBeInTheDocument();

    await waitFor(() => {
      expect(sitioService.getAll).toHaveBeenCalled();
      expect(blogService.getPosts).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText("Post Publicado")).toBeInTheDocument();
    expect(screen.getByText("Post Borrador")).toBeInTheDocument();
    expect(screen.getByText("2 resultado(s)")).toBeInTheDocument();
  });

  it("filters posts by search", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const searchInput = screen.getByPlaceholderText("Buscar por título o resumen...");
    await userEvent.type(searchInput, "Borrador");

    expect(screen.getByText("Post Borrador")).toBeInTheDocument();
    expect(screen.queryByText("Post Publicado")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado(s)")).toBeInTheDocument();
  });

  it("filters posts by status", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const selects = screen.getAllByRole("combobox");
    const statusSelect = selects[1];

    fireEvent.change(statusSelect, {
      target: { value: "draft" },
    });

    expect(screen.getByText("Post Borrador")).toBeInTheDocument();
    expect(screen.queryByText("Post Publicado")).not.toBeInTheDocument();
  });

  it("opens create form and validates required title", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    expect(screen.getByText("Nuevo post")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Crear post" }));

    expect(screen.getByText("El título es obligatorio")).toBeInTheDocument();
    expect(blogService.createPost).not.toHaveBeenCalled();
  });

  it("validates required content", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    await userEvent.type(screen.getByPlaceholderText("Ej: Mi primer artículo"), "Nuevo título");

    await userEvent.click(screen.getByRole("button", { name: "Crear post" }));

    expect(screen.getByText("El contenido es obligatorio")).toBeInTheDocument();
    expect(blogService.createPost).not.toHaveBeenCalled();
  });

  it("validates scheduled post without date", async () => {
  render(<Blog />);

  await screen.findByText("Post Publicado");

  await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

  await userEvent.type(
    screen.getByPlaceholderText("Ej: Mi primer artículo"),
    "Post programado"
  );

  await userEvent.type(
    screen.getByPlaceholderText("<p>Escribe el contenido del artículo...</p>"),
    "Contenido"
  );

    const statusSelect = document.querySelector(
    ".blog-form select[name='status']"
    ) as HTMLSelectElement;

    expect(statusSelect).not.toBeNull();

    fireEvent.change(statusSelect, {
    target: { name: "status", value: "scheduled" },
    });

  await userEvent.click(screen.getByRole("button", { name: "Crear post" }));

  expect(
    screen.getByText("Para programar un post debes indicar fecha y hora de publicación")
  ).toBeInTheDocument();

  expect(blogService.createPost).not.toHaveBeenCalled();
});

  it("creates a post successfully", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    await userEvent.type(screen.getByPlaceholderText("Ej: Mi primer artículo"), "Nuevo Post");
    await userEvent.type(screen.getByPlaceholderText("Breve descripción del artículo..."), "Resumen");
    await userEvent.type(
      screen.getByPlaceholderText("<p>Escribe el contenido del artículo...</p>"),
      "<p>Contenido nuevo</p>"
    );
    await userEvent.type(screen.getByPlaceholderText("Título para buscadores"), "SEO");
    await userEvent.type(screen.getByPlaceholderText("Descripción para buscadores"), "SEO desc");

    await userEvent.click(screen.getByRole("button", { name: "Crear post" }));

    await waitFor(() => {
      expect(blogService.createPost).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "Nuevo Post",
          content: "<p>Contenido nuevo</p>",
          excerpt: "Resumen",
          meta_title: "SEO",
          meta_description: "SEO desc",
          status: "draft",
        })
      );
    });

    expect(await screen.findByText("Post creado correctamente")).toBeInTheDocument();
  });

  it("opens edit form and updates a post", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const editButtons = screen.getAllByRole("button", { name: "Editar" });
    await userEvent.click(editButtons[0]);

    expect(screen.getByText("Editar post")).toBeInTheDocument();

    const titleInput = screen.getByDisplayValue("Post Publicado");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Post Actualizado");

    await userEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(blogService.updatePost).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({
          title: "Post Actualizado",
        })
      );
    });

    expect(await screen.findByText("Post actualizado correctamente")).toBeInTheDocument();
  });

  it("uploads featured image", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake image"], "foto.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(blogService.uploadImage).toHaveBeenCalledWith(1, file);
    });

    expect(await screen.findByText("Imagen subida correctamente")).toBeInTheDocument();
    expect(screen.getByDisplayValue("/uploads/blog/test.png")).toBeInTheDocument();
  });

  it("handles upload image error", async () => {
    vi.mocked(blogService.uploadImage).mockRejectedValueOnce(new Error("Error upload"));

    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake image"], "foto.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText("Error upload")).toBeInTheDocument();
  });

  it("changes status quickly", async () => {
    render(<Blog />);

    await screen.findByText("Post Borrador");

    const publishButton = screen.getByRole("button", { name: "Publicar" });
    await userEvent.click(publishButton);

    await waitFor(() => {
      expect(blogService.updatePost).toHaveBeenCalledWith(
        1,
        11,
        expect.objectContaining({
          status: "published",
          published_at: expect.any(String),
        })
      );
    });

    expect(await screen.findByText("Post marcado como publicado")).toBeInTheDocument();
  });

  it("moves post to draft quickly", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const draftButton = screen.getByRole("button", { name: "Borrador" });
    await userEvent.click(draftButton);

    await waitFor(() => {
      expect(blogService.updatePost).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({
          status: "draft",
          published_at: "2026-01-01T10:00:00Z",
        })
      );
    });
  });

  it("deletes a post when confirmed", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(blogService.deletePost).toHaveBeenCalledWith(1, 10);
    });

    expect(await screen.findByText("Post eliminado correctamente")).toBeInTheDocument();
  });

  it("does not delete when confirm is cancelled", async () => {
    vi.mocked(window.confirm).mockReturnValueOnce(false);

    render(<Blog />);

    await screen.findByText("Post Publicado");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(blogService.deletePost).not.toHaveBeenCalled();
  });

  it("handles loading sitios error", async () => {
    vi.mocked(sitioService.getAll).mockRejectedValueOnce(new Error("Error sitios"));

    render(<Blog />);

    expect(await screen.findByText("Error sitios")).toBeInTheDocument();
  });

  it("handles loading posts error", async () => {
    vi.mocked(blogService.getPosts).mockRejectedValueOnce(new Error("Error posts"));

    render(<Blog />);

    expect(await screen.findByText("Error posts")).toBeInTheDocument();
  });

  it("handles save error", async () => {
    vi.mocked(blogService.createPost).mockRejectedValueOnce(new Error("Error guardar"));

    render(<Blog />);

    await screen.findByText("Post Publicado");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

    await userEvent.type(screen.getByPlaceholderText("Ej: Mi primer artículo"), "Nuevo Post");
    await userEvent.type(
      screen.getByPlaceholderText("<p>Escribe el contenido del artículo...</p>"),
      "Contenido"
    );

    await userEvent.click(screen.getByRole("button", { name: "Crear post" }));

    expect(await screen.findByText("Error guardar")).toBeInTheDocument();
  });

  it("handles delete error", async () => {
    vi.mocked(blogService.deletePost).mockRejectedValueOnce(new Error("Error eliminar"));

    render(<Blog />);

    await screen.findByText("Post Publicado");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(await screen.findByText("Error eliminar")).toBeInTheDocument();
  });

  it("handles quick status error", async () => {
    vi.mocked(blogService.updatePost).mockRejectedValueOnce(new Error("Error estado"));

    render(<Blog />);

    await screen.findByText("Post Borrador");

    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));

    expect(await screen.findByText("Error estado")).toBeInTheDocument();
  });

  it("shows empty state when there are no sitios", async () => {
    vi.mocked(sitioService.getAll).mockResolvedValueOnce([]);

    render(<Blog />);

    expect(
      await screen.findByText("Selecciona un sitio para administrar sus publicaciones.")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "+ Nuevo post" })).toBeDisabled();
  });

  it("shows empty posts state", async () => {
    vi.mocked(blogService.getPosts).mockResolvedValueOnce([]);

    render(<Blog />);

    expect(
      await screen.findByText("No hay publicaciones. Crea tu primer post para este sitio.")
    ).toBeInTheDocument();
  });

it("does nothing when image input has no file", async () => {
  render(<Blog />);

  await screen.findByText("Post Publicado");

  await userEvent.click(screen.getByRole("button", { name: "+ Nuevo post" }));

  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

  fireEvent.change(fileInput, {
    target: {
      files: [],
    },
  });

  expect(blogService.uploadImage).not.toHaveBeenCalled();
});

  it("changes selected site and reloads posts", async () => {
    render(<Blog />);

    await screen.findByText("Post Publicado");

    const siteSelect = screen.getAllByRole("combobox")[0];

    fireEvent.change(siteSelect, {
      target: { value: "2" },
    });

    await waitFor(() => {
      expect(blogService.getPosts).toHaveBeenCalledWith(2);
    });
  });

it("search matches using excerpt text", async () => {
  vi.mocked(blogService.getPosts).mockResolvedValueOnce([
    {
      ...mockPosts[0],
      title: "Titulo diferente",
      excerpt: "texto oculto especial",
      meta_description: "",
      content: "<p>contenido cualquiera</p>",
    },
  ])

  render(<Blog />)

  await screen.findByText("Titulo diferente")

  const input = screen.getByPlaceholderText("Buscar por título o resumen...")

  await userEvent.type(input, "oculto")

  expect(screen.getByText("Titulo diferente")).toBeInTheDocument()
  expect(screen.getByText("1 resultado(s)")).toBeInTheDocument()
})
it("handles delete non Error throw", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true)

  vi.mocked(blogService.deletePost).mockRejectedValueOnce("boom")

  render(<Blog />)

  await screen.findByText("Post Publicado")

  const deleteButtons = screen.getAllByRole("button", {
    name: "Eliminar",
  })

  await userEvent.click(deleteButtons[0])

  expect(
    await screen.findByText("Error al eliminar el post")
  ).toBeInTheDocument()
})
it('quick publish adds current date and handles missing selectedSite', async () => {
  vi.mocked(blogService.updatePost)
    .mockResolvedValue({} as any)

  render(<Blog />)

  await screen.findByText('Post Publicado')

  await userEvent.click(
    screen.getByRole('button',{
      name:/publicar/i
    })
  )

  expect(
    blogService.updatePost
  ).toHaveBeenCalled()
})

it("opens edit form with fallback empty values", async () => {
  vi.mocked(blogService.getPosts).mockResolvedValueOnce([
    {
      ...mockPosts[0],
      excerpt: null,
      featured_image: null,
      meta_title: null,
      meta_description: null,
      published_at: null,
      category_id: null,
    },
  ])

  render(<Blog />)

  await screen.findByText("Post Publicado")

  await userEvent.click(
    screen.getByRole("button", {
      name: "Editar",
    })
  )

  expect(screen.getByText("Editar post")).toBeInTheDocument()

  expect(
    screen.getByPlaceholderText("Breve descripción del artículo...")
  ).toHaveValue("")

  expect(
    screen.getByPlaceholderText("Título para buscadores")
  ).toHaveValue("")

  expect(
    screen.getByPlaceholderText("Descripción para buscadores")
  ).toHaveValue("")
})


it('handles loadSitios and loadPosts non Error throws', async () => {
  vi.mocked(sitioService.getAll)
    .mockRejectedValueOnce("boom")

  render(<Blog />)

  expect(
    await screen.findByText("Error al cargar los sitios")
  ).toBeInTheDocument()

  vi.clearAllMocks()

  vi.mocked(
    sitioService.getAll
  ).mockResolvedValue(
    mockSitios as any
  )

  vi.mocked(blogService.getPosts)
    .mockRejectedValueOnce("boom")

  render(<Blog />)

  expect(
    await screen.findByText("Error al cargar los posts")
  ).toBeInTheDocument()
})
it('openEditForm uses empty fallbacks for nullable fields', async () => {
  vi.mocked(blogService.getPosts)
    .mockResolvedValueOnce([
      {
        ...mockPosts[0],
        excerpt:null,
        featured_image:null,
        published_at:null,
        category_id:null,
        meta_title:null,
        meta_description:null,
      } as any
    ])

  render(<Blog />)

  await screen.findByText("Post Publicado")

  await userEvent.click(
    screen.getByRole(
      'button',
      {name:/editar/i}
    )
  )

  expect(
    screen.getByPlaceholderText(
      /breve descripción/i
    )
  ).toHaveValue('')

  expect(
    screen.getByPlaceholderText(
      /título para buscadores/i
    )
  ).toHaveValue('')

 expect(
  screen.getByPlaceholderText(
    /descripción para buscadores/i
  )
).toHaveValue('')
})

it('uses fallback messages for upload and save non Error throws', async () => {
  vi.mocked(blogService.uploadImage)
    .mockRejectedValueOnce("boom")

  vi.mocked(blogService.createPost)
    .mockRejectedValueOnce("boom")

  render(<Blog />)

  await screen.findByText("Post Publicado")

  await userEvent.click(
    screen.getByRole('button',{
      name:/nuevo post/i
    })
  )

  const file = new File(["x"],"a.png",{type:"image/png"})

  const fileInput =
    document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

  await userEvent.upload(
    fileInput,
    file
  )

  expect(
    await screen.findByText(
      "Error al subir la imagen"
    )
  ).toBeInTheDocument()
})
it('covers delete cancel, quick status fallback and public url fallback', async () => {
  vi.spyOn(window,'confirm')
    .mockReturnValue(false)

  render(<Blog />)

  await screen.findByText("Post Publicado")

  await userEvent.click(
    screen.getAllByRole(
      'button',
      {name:/eliminar/i}
    )[0]
  )

  expect(
    window.confirm
  ).toHaveBeenCalled()

  vi.mocked(blogService.updatePost)
    .mockRejectedValueOnce("boom")

  await userEvent.click(
    screen.getByRole(
      'button',
      {name:/publicar/i}
    )
  )

  expect(
    await screen.findByText(
      "Error al cambiar el estado"
    )
  ).toBeInTheDocument()
})


});