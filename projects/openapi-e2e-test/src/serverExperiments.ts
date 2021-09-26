import http from 'http'

const server = http.createServer((req, res) => {
  const {
    aborted,
    complete,
    destroyed,
    headers,
    httpVersion,
    httpVersionMajor,
    httpVersionMinor,
    rawHeaders,
    trailers,
    method,
    statusCode,
    statusMessage,
    url,
    rawTrailers,
    readable,
    readableEncoding,
    readableEnded,
    readableFlowing,
    readableHighWaterMark,
    readableLength,
    readableObjectMode,
  } = req
  const data = {
    aborted,
    complete,
    destroyed,
    headers,
    httpVersion,
    httpVersionMajor,
    httpVersionMinor,
    rawHeaders,
    trailers,
    method,
    statusCode,
    statusMessage,
    url,
    rawTrailers,
    readable,
    readableEncoding,
    readableEnded,
    readableFlowing,
    readableHighWaterMark,
    readableLength,
    readableObjectMode,
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data, null, 2), 'utf-8')
})

server.listen(8000)
