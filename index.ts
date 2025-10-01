import { reactive } from "vue";

export type ReactivePromise<T> = {
  state: "PENDING" | "RESOLVED" | "REJECTED";
  value: T | undefined;
  error: unknown | undefined;
};

export function reactivePromise<T>(promise: Promise<T>): ReactivePromise<T> {
  const rp: ReactivePromise<T> = reactive({
    state: "PENDING",
    value: undefined,
    error: undefined,
  });

  promise
    .then((v) => {
      rp.value = v;
      rp.state = "RESOLVED";
    })
    .catch((e) => {
      rp.error = e;
      rp.state = "REJECTED";
    });

  return rp;
}
