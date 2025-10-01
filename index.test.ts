import { expect, test, vi } from "vitest";
import { reactivePromise } from "./index";
import { watch } from "vue";

test("resolve", async () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve("hello"), 100);
  });

  const result = reactivePromise(promise);

  const stateEffect = vi.fn();
  const valueEffect = vi.fn();
  const errorEffect = vi.fn();

  watch(() => result.state, stateEffect);
  watch(() => result.value, valueEffect);
  watch(() => result.error, errorEffect);

  expect(result.state).toBe("PENDING");
  expect(result.value).toBe(undefined);
  expect(result.error).toBe(undefined);

  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  expect(result.state).toBe("RESOLVED");
  expect(result.value).toBe("hello");
  expect(result.error).toBe(undefined);
  expect(stateEffect).toBeCalledTimes(1);
  expect(valueEffect).toBeCalledTimes(1);
  expect(errorEffect).toBeCalledTimes(0);
});

test("reject", async () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => reject("bye"), 100);
  });

  const result = reactivePromise(promise);

  const stateEffect = vi.fn();
  const valueEffect = vi.fn();
  const errorEffect = vi.fn();

  watch(() => result.state, stateEffect);
  watch(() => result.value, valueEffect);
  watch(() => result.error, errorEffect);

  expect(result.state).toBe("PENDING");
  expect(result.value).toBe(undefined);
  expect(result.error).toBe(undefined);

  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  expect(result.state).toBe("REJECTED");
  expect(result.value).toBe(undefined);
  expect(result.error).toBe("bye");
  expect(stateEffect).toBeCalledTimes(1);
  expect(valueEffect).toBeCalledTimes(0);
  expect(errorEffect).toBeCalledTimes(1);
});
