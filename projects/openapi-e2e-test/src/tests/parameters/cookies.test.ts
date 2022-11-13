import { cookiesSdk } from '../sdks'
import { testCookiesServer } from '../servers'
import { USER_NAME } from './userName'

describe('Cookies', () => {
  testCookiesServer()
  it('should properly transmit cookies', async () => {
    const loginResult = await cookiesSdk.login({
      mimeType: 'application/json',
      body: { name: USER_NAME },
    })
    if (loginResult.statusCode !== 200) {
      fail(`Status code should be 200`)
    }
    expect(loginResult.cookies).toHaveLength(1)
    const token = loginResult.cookies[0]
    expect(token?.name).toBe('token')
    expect(token?.value).toBe(USER_NAME)

    const protResult = await cookiesSdk.protectedPath({ cookies: { token: token?.value! } })
    if (protResult.statusCode !== 200) {
      fail(`Status code should be 200`)
    }
    expect(protResult.body.name).toBe(token?.value)
  })
})
