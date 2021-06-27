module.exports = async function globalTeardown() {
  const _global = global as any
  await _global.server.shutdown()
}
