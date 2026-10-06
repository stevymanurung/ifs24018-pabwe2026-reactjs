import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useInput from "./useInput";

describe("useInput", () => {
  it("bernilai string kosong secara default dan berubah lewat onChange", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
    act(() => result.current[1]({ target: { value: "halo" } }));
    expect(result.current[0]).toBe("halo");
  });

  it("memakai nilai awal dan setter manual", () => {
    const { result } = renderHook(() => useInput("awal"));
    expect(result.current[0]).toBe("awal");
    act(() => result.current[2]("baru"));
    expect(result.current[0]).toBe("baru");
  });
});
