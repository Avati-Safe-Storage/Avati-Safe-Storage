import { useState } from "react";

const sentinel = Symbol.for("react.memo_cache_sentinel");

// React Compiler runtime stub for React 18 compatibility.
// Persists the cache array across renders and populates it with the required React sentinel.
export function c(size: number) {
  return useState(() => {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
      arr[i] = sentinel;
    }
    return arr;
  })[0];
}
