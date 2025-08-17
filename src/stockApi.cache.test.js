import { getStockData, __clearStockCache } from "./stockApi";

describe("getStockData memoization", () => {
  let originalFetch;
  let now;
  beforeAll(() => {
    originalFetch = global.fetch;
  });
  beforeEach(() => {
    __clearStockCache();
    now = 100000;
    jest.spyOn(Date, "now").mockImplementation(() => now);
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("caches within TTL", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ c: 123 }),
    });
    const first = await getStockData("AAPL", { ttlMs: 60000 });
    expect(first).toBe(123);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // second call before TTL
    const second = await getStockData("AAPL", { ttlMs: 60000 });
    expect(second).toBe(123);
    expect(global.fetch).toHaveBeenCalledTimes(1); // no extra call
  });

  it("refreshes after TTL expiry", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 10 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 11 }) });
    const a = await getStockData("MSFT", { ttlMs: 50 });
    expect(a).toBe(10);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    now += 49; // still within ttl
    const b = await getStockData("MSFT", { ttlMs: 50 });
    expect(b).toBe(10);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    now += 2; // ttl exceeded
    const c = await getStockData("MSFT", { ttlMs: 50 });
    expect(c).toBe(11);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("force refresh bypasses cache", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 50 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 55 }) });
    const first = await getStockData("GOOG");
    expect(first).toBe(50);
    const second = await getStockData("GOOG", { force: true });
    expect(second).toBe(55);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("returns cached value on network error", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ c: 77 }) })
      .mockRejectedValueOnce(new Error("network"));
    const first = await getStockData("TSLA");
    expect(first).toBe(77);
    // force expiry for next attempt
    now += 61000;
    const second = await getStockData("TSLA");
    expect(second).toBe(77); // fallback to cached
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("returns false when initial fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("boom"));
    const val = await getStockData("FAIL");
    expect(val).toBe(false);
  });

  it("dedupes concurrent in-flight fetches", async () => {
    __clearStockCache();
    let resolveFetch;
    const fetchPromise = new Promise((res) => (resolveFetch = res));
    global.fetch.mockReturnValue(fetchPromise);
    const p1 = getStockData("AMZN");
    const p2 = getStockData("AMZN");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // Now resolve fetch
    resolveFetch({ ok: true, json: async () => ({ c: 999 }) });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(999);
    expect(r2).toBe(999);
    // Second round within TTL should not refetch
    const r3 = await getStockData("AMZN");
    expect(r3).toBe(999);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("negative caches 4xx and avoids refetch within TTL", async () => {
    __clearStockCache();
    now = 500000;
    jest.spyOn(Date, "now").mockImplementation(() => now);
    global.fetch.mockResolvedValueOnce({ ok: false });
    const first = await getStockData("BAD", { ttlMs: 60000 });
    expect(first).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // Within TTL
    now += 1000;
    const second = await getStockData("BAD", { ttlMs: 60000 });
    expect(second).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // After TTL expires, should fetch again
    now += 60001;
    global.fetch.mockResolvedValueOnce({ ok: false });
    const third = await getStockData("BAD", { ttlMs: 60000 });
    expect(third).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
