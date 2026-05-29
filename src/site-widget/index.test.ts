import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  handleLogin: vi.fn(),
  handleRegister: vi.fn(),
  handleLogout: vi.fn(),
  loadProfile: vi.fn(),
  initBlogBlocks: vi.fn(),
  initTiendaBlocks: vi.fn(),
}));

vi.mock("./auth", () => ({
  handleLogin: mocks.handleLogin,
  handleRegister: mocks.handleRegister,
  handleLogout: mocks.handleLogout,
}));

vi.mock("./perfil", () => ({
  loadProfile: mocks.loadProfile,
}));

vi.mock("./blog", () => ({
  initBlogBlocks: mocks.initBlogBlocks,
}));

vi.mock("./tienda", () => ({
  initTiendaBlocks: mocks.initTiendaBlocks,
}));

async function importFreshIndex() {
  vi.resetModules();
  await import("./index");
}

describe("site-widget index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    document.body.innerHTML = "";
    localStorage.clear();

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete",
    });
  });

  it("initializes auth forms, profile, blog and tienda when document is complete", async () => {
    localStorage.setItem("site_token", "abc");

    document.body.innerHTML = `
      <div data-auth="login"><form></form></div>
      <div data-auth="registro"><form></form></div>
      <button data-auth="logout"></button>
      <div data-auth="perfil"></div>
    `;

    await importFreshIndex();

    expect(mocks.handleLogin).toHaveBeenCalledTimes(1);
    expect(mocks.handleRegister).toHaveBeenCalledTimes(1);
    expect(mocks.handleLogout).toHaveBeenCalledTimes(1);
    expect(mocks.loadProfile).toHaveBeenCalledTimes(1);
    expect(mocks.initBlogBlocks).toHaveBeenCalledTimes(1);
    expect(mocks.initTiendaBlocks).toHaveBeenCalledTimes(1);

    expect(document.querySelector<HTMLElement>('[data-auth="login"]')!.style.display)
      .toBe("none");
    expect(document.querySelector<HTMLElement>('[data-auth="perfil"]')!.style.display)
      .toBe("");
  });

  it("hides perfil block when token does not exist", async () => {
    document.body.innerHTML = `
      <div data-auth="perfil"></div>
      <div data-auth="login"></div>
    `;

    await importFreshIndex();

    expect(document.querySelector<HTMLElement>('[data-auth="perfil"]')!.style.display)
      .toBe("none");

    expect(mocks.loadProfile).not.toHaveBeenCalled();
  });

  it("hides perfil block when localStorage throws", async () => {
    document.body.innerHTML = `
      <div data-auth="perfil"></div>
    `;

    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("localStorage error");
      });

    await importFreshIndex();

    expect(document.querySelector<HTMLElement>('[data-auth="perfil"]')!.style.display)
      .toBe("none");

    spy.mockRestore();
  });

  it("keeps login block visible when there is no token", async () => {
    document.body.innerHTML = `
      <div data-auth="login"></div>
    `;

    await importFreshIndex();

    expect(document.querySelector<HTMLElement>('[data-auth="login"]')!.style.display)
      .toBe("");
  });

  it("handles localStorage error in login block without crashing", async () => {
    document.body.innerHTML = `
      <div data-auth="login"></div>
    `;

    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("localStorage error");
      });

    await expect(importFreshIndex()).resolves.toBeUndefined();

    spy.mockRestore();
  });

  it("waits for DOMContentLoaded when document is loading", async () => {
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading",
    });

    document.body.innerHTML = `
      <div data-auth="login"><form></form></div>
    `;

    await importFreshIndex();

    expect(mocks.handleLogin).not.toHaveBeenCalled();

    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(mocks.handleLogin).toHaveBeenCalledTimes(1);
    expect(mocks.initBlogBlocks).toHaveBeenCalledTimes(1);
    expect(mocks.initTiendaBlocks).toHaveBeenCalledTimes(1);
  });
});