function logProgress(count, n) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(count + "/" + n);
}

module.exports = { logProgress };
