const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

// FIXME: report the error so is obvious to the user.
workerClient.addEventListener('error', console.error);