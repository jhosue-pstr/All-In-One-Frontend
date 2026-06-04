import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Tienda from "./Tienda";
import { sitioService } from "../../services/sitio";
import { storeService } from "../../services/store";
import "@testing-library/jest-dom/vitest";

vi.mock("../../services/sitio", () => ({
  sitioService: {
    getAll: vi.fn(),
  },
}));

vi.mock("../../services/store", () => ({
  storeService: {
    getProducts: vi.fn(),
    getCategorias: vi.fn(),
    getPedidos: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    createCategoria: vi.fn(),
    updateCategoria: vi.fn(),
    deleteCategoria: vi.fn(),
    getPedido: vi.fn(),
    updatePedidoEstado: vi.fn(),
  },
}));

const mockSitios = [
  {
    id: 1,
    nombre: "Sitio Tienda",
    slug: "sitio-tienda",
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

const mockProductos = [
  {
    id: 10,
    site_id: 1,
    categoria_id: 1,
    nombre: "Laptop Gamer",
    slug: "laptop-gamer",
    descripcion: "Laptop potente",
    sku: "LAP-001",
    precio: 3500,
    precio_comparacion: 4000,
    costo: 2500,
    stock: 10,
    stock_minimo: 2,
    imagenes: ["https://example.com/laptop.png"],
    es_activo: true,
    es_featured: true,
    controlar_alertas: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 11,
    site_id: 1,
    categoria_id: null,
    nombre: "Mouse Inactivo",
    slug: "mouse-inactivo",
    descripcion: "Mouse",
    sku: "MOU-001",
    precio: 50,
    precio_comparacion: null,
    costo: null,
    stock: 0,
    stock_minimo: 0,
    imagenes: [],
    es_activo: false,
    es_featured: false,
    controlar_alertas: true,
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  },
] as any[];

const mockCategorias = [
  {
    id: 1,
    site_id: 1,
    nombre: "Electrónicos",
    slug: "electronicos",
    descripcion: "Categoría electrónica",
    imagen: "https://example.com/cat.png",
    activa: true,
    orden: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    site_id: 1,
    nombre: "Archivados",
    slug: "archivados",
    descripcion: "",
    imagen: "",
    activa: false,
    orden: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
] as any[];

const mockPedidos = [
  {
    id: 100,
    site_id: 1,
    numero_pedido: "PED-001",
    nombre_cliente: "Juan Pérez",
    email_cliente: "juan@test.com",
    total: 3550,
    estado: "pendiente",
    estado_pago: "pendiente",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 101,
    site_id: 1,
    numero_pedido: "PED-002",
    nombre_cliente: "Ana Torres",
    email_cliente: "ana@test.com",
    total: 100,
    estado: "enviado",
    estado_pago: "pagado",
    created_at: "2026-01-02T00:00:00Z",
  },
] as any[];

const mockPedidoDetail = {
  id: 100,
  site_id: 1,
  numero_pedido: "PED-001",
  nombre_cliente: "Juan Pérez",
  email_cliente: "juan@test.com",
  telefono_cliente: "999888777",
  total: 3550,
  estado: "pendiente",
  metodo_pago: "tarjeta",
  estado_pago: "pendiente",
  direccion_envio: "Av. Principal 123",
  ciudad_envio: "Lima",
  pais_envio: "Perú",
  codigo_postal: "15001",
  notas: "Entregar rápido",
  created_at: "2026-01-01T00:00:00Z",
  items: [
    {
      id: 1,
      nombre_producto: "Laptop Gamer",
      sku_producto: "LAP-001",
      cantidad: 1,
      precio_unitario: 3500,
      total: 3500,
    },
  ],
} as any;

describe("Tienda page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(sitioService.getAll).mockResolvedValue(mockSitios as any);

    vi.mocked(storeService.getProducts).mockResolvedValue({
      data: mockProductos,
      total: mockProductos.length,
    } as any);

    vi.mocked(storeService.getCategorias).mockResolvedValue({
      data: mockCategorias,
      total: mockCategorias.length,
    } as any);

    vi.mocked(storeService.getPedidos).mockResolvedValue({
      data: mockPedidos,
      total: mockPedidos.length,
    } as any);

    vi.mocked(storeService.createProduct).mockResolvedValue(mockProductos[0]);
    vi.mocked(storeService.updateProduct).mockResolvedValue(mockProductos[0]);
    vi.mocked(storeService.deleteProduct).mockResolvedValue(undefined as any);

    vi.mocked(storeService.createCategoria).mockResolvedValue(mockCategorias[0]);
    vi.mocked(storeService.updateCategoria).mockResolvedValue(mockCategorias[0]);
    vi.mocked(storeService.deleteCategoria).mockResolvedValue(undefined as any);

    vi.mocked(storeService.getPedido).mockResolvedValue(mockPedidoDetail);
    vi.mocked(storeService.updatePedidoEstado).mockResolvedValue(mockPedidoDetail);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        url: "/uploads/tienda/producto.png",
      }),
    }) as any;
  });

  it("loads sitios, products, categories and pedidos", async () => {
    render(<Tienda />);

    expect(screen.getByText("Administración de Tienda")).toBeInTheDocument();

    await waitFor(() => {
      expect(sitioService.getAll).toHaveBeenCalled();
      expect(storeService.getProducts).toHaveBeenCalledWith(1, { solo_activos: false });
      expect(storeService.getCategorias).toHaveBeenCalledWith(1, false);
      expect(storeService.getPedidos).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText("Laptop Gamer")).toBeInTheDocument();
    expect(screen.getByText("Mouse Inactivo")).toBeInTheDocument();
    expect(screen.getByText("2 resultado(s)")).toBeInTheDocument();
  });

  it("filters products by search", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.type(screen.getByPlaceholderText("Buscar productos..."), "mouse");

    expect(screen.getByText("Mouse Inactivo")).toBeInTheDocument();
    expect(screen.queryByText("Laptop Gamer")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado(s)")).toBeInTheDocument();
  });

  it("shows empty products state", async () => {
    vi.mocked(storeService.getProducts).mockResolvedValueOnce({
      data: [],
      total: 0,
    } as any);

    render(<Tienda />);

    expect(
      await screen.findByText("No hay productos. Crea tu primer producto para este sitio.")
    ).toBeInTheDocument();
  });

  it("opens product form and validates required name", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    expect(screen.getByText("Nuevo producto")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(storeService.createProduct).not.toHaveBeenCalled();
  });

  it("validates product price", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    await userEvent.type(
      screen.getByPlaceholderText("Ej: Camiseta de algodón"),
      "Producto Test"
    );

    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(screen.getByText("El precio debe ser mayor a 0")).toBeInTheDocument();
    expect(storeService.createProduct).not.toHaveBeenCalled();
  });

  it("creates product successfully", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    await userEvent.type(
      screen.getByPlaceholderText("Ej: Camiseta de algodón"),
      "Producto Nuevo"
    );

    expect(screen.getByPlaceholderText("camiseta-de-algodon")).toHaveValue("producto-nuevo");

    await userEvent.type(screen.getByPlaceholderText("Descripción del producto..."), "Descripción");
    await userEvent.type(screen.getByPlaceholderText("Ej: CAM-001"), "SKU-001");
    await userEvent.type(screen.getByPlaceholderText("99.90"), "120");
    await userEvent.type(screen.getByPlaceholderText("129.90"), "150");
    await userEvent.type(screen.getByPlaceholderText("45.00"), "80");

    const stockInput = document.querySelector("input[name='stock']") as HTMLInputElement;
    const stockMinInput = document.querySelector("input[name='stock_minimo']") as HTMLInputElement;
    const categorySelect = document.querySelector("select[name='categoria_id']") as HTMLSelectElement;
    const featuredCheckbox = document.querySelector("input[name='es_featured']") as HTMLInputElement;

    fireEvent.change(stockInput, { target: { name: "stock", value: "15" } });
    fireEvent.change(stockMinInput, { target: { name: "stock_minimo", value: "3" } });
    fireEvent.change(categorySelect, { target: { name: "categoria_id", value: "1" } });
    await userEvent.click(featuredCheckbox);

    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    await waitFor(() => {
      expect(storeService.createProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          nombre: "Producto Nuevo",
          slug: "producto-nuevo",
          descripcion: "Descripción",
          sku: "SKU-001",
          precio: 120,
          precio_comparacion: 150,
          costo: 80,
          stock: 15,
          stock_minimo: 3,
          categoria_id: 1,
          es_featured: true,
        })
      );
    });

    expect(await screen.findByText("Producto creado correctamente")).toBeInTheDocument();
  });

  it("opens edit product form and updates product", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    const editButtons = screen.getAllByRole("button", { name: "Editar" });
    await userEvent.click(editButtons[0]);

    expect(screen.getByText("Editar producto")).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue("Laptop Gamer");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Laptop Editada");

    await userEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(storeService.updateProduct).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({
          nombre: "Laptop Editada",
        })
      );
    });

    expect(await screen.findByText("Producto actualizado correctamente")).toBeInTheDocument();
  });

  it("deletes product when confirmed", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(storeService.deleteProduct).toHaveBeenCalledWith(1, 10);
    });

    expect(await screen.findByText("Producto eliminado correctamente")).toBeInTheDocument();
  });

  it("does not delete product when confirm is cancelled", async () => {
    vi.mocked(window.confirm).mockReturnValueOnce(false);

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(storeService.deleteProduct).not.toHaveBeenCalled();
  });

  it("handles product save error", async () => {
    vi.mocked(storeService.createProduct).mockRejectedValueOnce(new Error("Error producto"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    await userEvent.type(screen.getByPlaceholderText("Ej: Camiseta de algodón"), "Producto");
    await userEvent.type(screen.getByPlaceholderText("99.90"), "50");

    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(await screen.findByText("Error producto")).toBeInTheDocument();
  });

  it("handles product delete error", async () => {
    vi.mocked(storeService.deleteProduct).mockRejectedValueOnce(new Error("Error eliminar producto"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(await screen.findByText("Error eliminar producto")).toBeInTheDocument();
  });

  it("uploads product image successfully", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake image"], "producto.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    expect(await screen.findByText("Imagen subida correctamente")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("URL de imagen")).toHaveValue("/uploads/tienda/producto.png");
  });

  it("handles product image upload error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error("Error upload")) as any;

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake image"], "producto.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText("Error upload")).toBeInTheDocument();
  });

  it("does nothing when image input has no file", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("shows loading sitios error", async () => {
    vi.mocked(sitioService.getAll).mockRejectedValueOnce(new Error("Error sitios"));

    render(<Tienda />);

    expect(await screen.findByText("Error sitios")).toBeInTheDocument();
  });

  it("shows loading products error", async () => {
    vi.mocked(storeService.getProducts).mockRejectedValueOnce(new Error("Error productos"));

    render(<Tienda />);

    expect(await screen.findByText("Error productos")).toBeInTheDocument();
  });

  it("shows empty state when no sitios", async () => {
    vi.mocked(sitioService.getAll).mockResolvedValueOnce([]);

    render(<Tienda />);

    expect(
      await screen.findByText("Selecciona un sitio para administrar su tienda.")
    ).toBeInTheDocument();
  });

  it("changes selected site and reloads data", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    const siteSelect = screen.getAllByRole("combobox")[0];

    fireEvent.change(siteSelect, {
      target: { value: "2" },
    });

    await waitFor(() => {
      expect(storeService.getProducts).toHaveBeenCalledWith(2, { solo_activos: false });
      expect(storeService.getCategorias).toHaveBeenCalledWith(2, false);
      expect(storeService.getPedidos).toHaveBeenCalledWith(2);
    });
  });

  it("shows categories tab and creates category", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));

    expect(screen.getByText("Electrónicos")).toBeInTheDocument();
    expect(screen.getByText("(inactiva)")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "+ Nueva categoría" }));

    expect(screen.getByText("Nueva categoría")).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText("Ej: Ropa"), "Accesorios");

    expect(screen.getByPlaceholderText("ropa")).toHaveValue("accesorios");

    await userEvent.type(screen.getByPlaceholderText("Descripción de la categoría..."), "Desc cat");
    await userEvent.type(screen.getByPlaceholderText("https://ejemplo.com/imagen.jpg"), "https://img.com/cat.png");

    await userEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    await waitFor(() => {
      expect(storeService.createCategoria).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          nombre: "Accesorios",
          slug: "accesorios",
          descripcion: "Desc cat",
          imagen: "https://img.com/cat.png",
        })
      );
    });

    expect(await screen.findByText("Categoría creada correctamente")).toBeInTheDocument();
  });

  it("validates required category name", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Nueva categoría" }));
    await userEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByText("El nombre de la categoría es obligatorio")).toBeInTheDocument();
  });

  it("edits category", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));

    const editButtons = screen.getAllByRole("button", { name: "Editar" });
    await userEvent.click(editButtons[0]);

    expect(screen.getByText("Editar categoría")).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue("Electrónicos");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Electrónica Editada");

    await userEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(storeService.updateCategoria).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({
          nombre: "Electrónica Editada",
        })
      );
    });

    expect(await screen.findByText("Categoría actualizada correctamente")).toBeInTheDocument();
  });

  it("deletes category", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(storeService.deleteCategoria).toHaveBeenCalledWith(1, 1);
    });

    expect(await screen.findByText("Categoría eliminada correctamente")).toBeInTheDocument();
  });

  it("does not delete category when confirm is cancelled", async () => {
    vi.mocked(window.confirm).mockReturnValueOnce(false);

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(storeService.deleteCategoria).not.toHaveBeenCalled();
  });

  it("handles category save error", async () => {
    vi.mocked(storeService.createCategoria).mockRejectedValueOnce(new Error("Error categoría"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Nueva categoría" }));
    await userEvent.type(screen.getByPlaceholderText("Ej: Ropa"), "Categoria Error");
    await userEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(await screen.findByText("Error categoría")).toBeInTheDocument();
  });

  it("handles category delete error", async () => {
    vi.mocked(storeService.deleteCategoria).mockRejectedValueOnce(new Error("Error eliminar categoría"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Categorías" }));

    const deleteButtons = screen.getAllByRole("button", { name: "Eliminar" });
    await userEvent.click(deleteButtons[0]);

    expect(await screen.findByText("Error eliminar categoría")).toBeInTheDocument();
  });

  it("shows pedidos tab, filters pedidos and opens detail", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Pedidos" }));

    expect(screen.getByText("PED-001")).toBeInTheDocument();
    expect(screen.getByText("PED-002")).toBeInTheDocument();

    const pedidoFilter = screen.getAllByRole("combobox")[1];

    fireEvent.change(pedidoFilter, {
      target: { value: "enviado" },
    });

    expect(screen.queryByText("PED-001")).not.toBeInTheDocument();
    expect(screen.getByText("PED-002")).toBeInTheDocument();

    fireEvent.change(pedidoFilter, {
      target: { value: "all" },
    });

    const viewButtons = screen.getAllByRole("button", { name: "Ver" });
    await userEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(storeService.getPedido).toHaveBeenCalledWith(1, 100);
    });

    expect(await screen.findByText("Pedido PED-001")).toBeInTheDocument();
    expect(screen.getByText("Entregar rápido")).toBeInTheDocument();
  });

  it("changes pedido status", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Pedidos" }));

    const viewButtons = screen.getAllByRole("button", { name: "Ver" });
    await userEvent.click(viewButtons[0]);

    await screen.findByText("Pedido PED-001");

    await userEvent.click(screen.getByRole("button", { name: "Procesando" }));

    await waitFor(() => {
      expect(storeService.updatePedidoEstado).toHaveBeenCalledWith(
        1,
        100,
        { estado: "procesando" }
      );
    });

    expect(await screen.findByText('Pedido actualizado a "Procesando"')).toBeInTheDocument();
  });

  it("handles pedido detail error", async () => {
    vi.mocked(storeService.getPedido).mockRejectedValueOnce(new Error("Error detalle"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Pedidos" }));

    const viewButtons = screen.getAllByRole("button", { name: "Ver" });
    await userEvent.click(viewButtons[0]);

    expect(await screen.findByText("Error al cargar detalle del pedido")).toBeInTheDocument();
  });

  it("handles pedido status update error", async () => {
    vi.mocked(storeService.updatePedidoEstado).mockRejectedValueOnce(new Error("Error estado pedido"));

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Pedidos" }));

    const viewButtons = screen.getAllByRole("button", { name: "Ver" });
    await userEvent.click(viewButtons[0]);

    await screen.findByText("Pedido PED-001");

    await userEvent.click(screen.getByRole("button", { name: "Procesando" }));

    expect(await screen.findByText("Error estado pedido")).toBeInTheDocument();
  });

  it("shows empty pedidos by filtered state", async () => {
    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(screen.getByRole("button", { name: "Pedidos" }));

    const pedidoFilter = screen.getAllByRole("combobox")[1];

    fireEvent.change(pedidoFilter, {
      target: { value: "cancelado" },
    });

    expect(screen.getByText("No hay pedidos con este estado.")).toBeInTheDocument();
  });



  it("closes pedido modal with close button", async () => {
  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Pedidos",
    })
  );

  const viewButtons = screen.getAllByRole("button", {
    name: "Ver",
  });

  await userEvent.click(viewButtons[0]);

  await screen.findByText("Pedido PED-001");

  await userEvent.click(
    screen.getByRole("button", {
      name: "×",
    })
  );

  await waitFor(() => {
    expect(screen.queryByText("Pedido PED-001")).not.toBeInTheDocument();
  });
});


it("shows empty categories state", async () => {
  vi.mocked(storeService.getCategorias).mockResolvedValueOnce({
    data: [],
    total: 0,
  } as any);

  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Categorías",
    })
  );

  expect(
    screen.getByText(
      "No hay categorías. Crea la primera categoría para organizar tus productos."
    )
  ).toBeInTheDocument();
});

it("shows loading pedidos state", async () => {
  vi.mocked(storeService.getPedidos).mockImplementationOnce(
    () => new Promise(() => {})
  );

  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Pedidos",
    })
  );

  expect(screen.getByText("Cargando pedidos...")).toBeInTheDocument();
});


it("shows loading categories state", async () => {
  vi.mocked(storeService.getCategorias).mockImplementationOnce(
    () => new Promise(() => {})
  );

  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Categorías",
    })
  );

  expect(screen.getByText("Cargando categorías...")).toBeInTheDocument();
});

it("closes pedido modal with cancel event", async () => {
  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Pedidos",
    })
  );

  const viewButtons = screen.getAllByRole("button", {
    name: "Ver",
  });

  await userEvent.click(viewButtons[0]);

  await screen.findByText("Pedido PED-001");

  const dialog = document.querySelector("dialog.tienda-modal-overlay")!;

  fireEvent(
    dialog,
    new Event("cancel", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(screen.queryByText("Pedido PED-001")).not.toBeInTheDocument();
  });
});


it("returns to products tab when clicking Productos", async () => {
  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Categorías",
    })
  );

  expect(screen.getByText("Electrónicos")).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole("button", {
      name: "Productos",
    })
  );

  expect(screen.getByText("Laptop Gamer")).toBeInTheDocument();
});


  it("renders pedido detail fallbacks for missing optional fields", async () => {
    const pedidoSinOpcionales = {
      id: 200,
      site_id: 1,
      numero_pedido: "PED-X",
      nombre_cliente: "Cliente Sin Datos",
      email_cliente: "sin@test.com",
      total: 99,
      estado: "desconocido",
      metodo_pago: null,
      estado_pago: "pendiente",
      direccion_envio: null,
      ciudad_envio: null,
      pais_envio: null,
      codigo_postal: null,
      notas: null,
      created_at: "2026-01-01T00:00:00Z",
      items: [
        {
          id: 99,
          nombre_producto: "Producto sin SKU",
          sku_producto: null,
          cantidad: 2,
          precio_unitario: 10,
          total: 20,
        },
      ],
    } as any;

    vi.mocked(storeService.getPedidos).mockResolvedValueOnce({
      data: [
        {
          id: 200,
          site_id: 1,
          numero_pedido: "PED-X",
          nombre_cliente: "Cliente Sin Datos",
          email_cliente: "sin@test.com",
          total: 99,
          estado: "desconocido",
          estado_pago: "pendiente",
          created_at: "2026-01-01T00:00:00Z",
        },
      ],
      total: 1,
    } as any);

    vi.mocked(storeService.getPedido).mockResolvedValueOnce(pedidoSinOpcionales);

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Pedidos",
      })
    );

    expect(await screen.findByText("desconocido")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", {
        name: "Ver",
      })
    );

    expect(await screen.findByText("Pedido PED-X")).toBeInTheDocument();

    expect(screen.getAllByText("desconocido").length).toBeGreaterThan(0);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    expect(screen.getByText("Producto sin SKU")).toBeInTheDocument();

    expect(screen.queryByText("DIRECCIÓN DE ENVÍO")).not.toBeInTheDocument();
    expect(screen.queryByText("NOTAS DEL PEDIDO")).not.toBeInTheDocument();
    expect(screen.queryByText("Teléfono")).not.toBeInTheDocument();
  });

  it("shows empty pedidos text when all filter has no pedidos", async () => {
    vi.mocked(storeService.getPedidos).mockResolvedValueOnce({
      data: [],
      total: 0,
    } as any);

    render(<Tienda />);

    await screen.findByText("Laptop Gamer");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Pedidos",
      })
    );

    expect(screen.getByText("No hay pedidos todavía.")).toBeInTheDocument();
  });
  it("opens edit product with null optional values", async () => {
    vi.mocked(storeService.getProducts).mockResolvedValueOnce({
      data: [
        {
          id: 99,
          nombre: "Producto Null",
          slug: "producto-null",
          precio: 100,
          precio_comparacion: null,
          stock: 5,
          es_activo: true,
          imagenes: [],
        },
      ],
      total: 1,
    } as any);

    render(<Tienda />);

    await screen.findByText("Producto Null");

    await userEvent.click(
      screen.getByRole("button", { name: /editar/i })
    );

    expect(
      screen.getByDisplayValue("Producto Null")
    ).toBeInTheDocument();
  });


  it("opens edit category with null description and image", async () => {
  const categoria = {
    id: 99,
    nombre: "Categoria Null",
    slug: "categoria-null",
    descripcion: null,
    imagen: null,
  };

  vi.mocked(storeService.getCategorias).mockResolvedValueOnce({
    data: [categoria],
    total: 1,
  } as any);

  render(<Tienda />);

  await screen.findByText("Laptop Gamer");

  await userEvent.click(
    screen.getByRole("button", {
      name: "Categorías",
    })
  );

  await screen.findByText("Categoria Null");

  const editButtons = screen.getAllByRole("button", {
    name: /editar/i,
  });

  await userEvent.click(editButtons[0]);

  expect(
    screen.getByDisplayValue("Categoria Null")
  ).toBeInTheDocument();
});


});