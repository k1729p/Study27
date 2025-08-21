let pauseFlag = false;

async function waitForFlag(): Promise<void> {
  while (true) {
    if (pauseFlag) {
      break;
    }
    await sleep(100);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example usage
setTimeout(() => {
  pauseFlag = true; // Simulate changing the flag to true after 1 second
}, 1000);

waitForFlag().then(() => {
  console.log("Finished waiting for flag.");
});
