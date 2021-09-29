export async function serialize(contentType: string, body: any): Promise<any> {
  switch (contentType) {
    case 'application/json':
      return JSON.stringify(body)
    case 'text/plain':
      return body?.toString()
    default:
      return body
  }
}
