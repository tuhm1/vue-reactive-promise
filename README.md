# vue-reactive-promise

Wraps `Promise` states in a Vue `reactive` object, simplifying handling asynchronous operations state.

## Installation

```bash
npm install vue-reactive-promise
```

## Usage

```vue
<script setup>
import { ref } from "vue";
import { reactivePromise } from "vue-reactive-promise";

const result = ref();

async function process() {
  return fetch("/api/process").then((res) => res.json());
}

function handleClick() {
  result.value = reactivePromise(process()); // 👈
}
</script>

<template>
  <button @click="handleClick">Process</button>

  <p v-if="!result">Click to start.</p>

  <p v-else-if="result.state === 'PENDING'">Processing...</p>

  <p v-else-if="result.state === 'REJECTED'">
    Error: {{ result.error.message }}
  </p>

  <p v-else-if="result.state === 'RESOLVED'">Result: {{ result.value }}</p>
</template>
```

## Benefits

This pattern seems common:

```js
const loading = ref();
const result = ref();
const error = ref();

async function handleSubmit() {
  try {
    loading.value = true;
    result.value = await process();
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
}
```

But it actually is error-prone. What if `handleSubmit` is called again and resolve before the previous execution resolve?

You won't have that problem with `reactivePromise`.

It also simplifies managing multiple asynchronous states.

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <button @click="item.details = reactivePromise(fetchDetails(item.id))">
      Fetch
    </button>
    <div v-if="item.details?.state === 'RESOLVED'">
      {{ item.details.value }}
    </div>
    <!-- ... -->
  </div>
</template>
```

## License

[MIT](http://opensource.org/licenses/MIT)
