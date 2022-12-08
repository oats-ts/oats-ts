import type { Validator } from '@oats-ts/validators'
import type { Try } from '@oats-ts/try'

export type ClientAdapter = {
  getPath<P>(input: P, descriptor: any): string
  getQuery<Q>(input: Q, descriptor: any): string | undefined
  getUrl(path: string, query?: string): string
  getCookieBasedRequestHeaders<C>(input?: C, descriptor?: any): RawHttpHeaders
  getParameterBasedRequestHeaders<H>(input: H, descriptor: any): RawHttpHeaders
  getMimeTypeBasedRequestHeaders(mimeType?: string): RawHttpHeaders
  getAuxiliaryRequestHeaders(): RawHttpHeaders
  getRequestBody<B>(mimeType?: string, input?: B): any
  request(request: RawHttpRequest): Promise<RawHttpResponse>
  getMimeType(response: RawHttpResponse): string | undefined
  getStatusCode(response: RawHttpResponse): number | undefined
  getResponseCookies(response: RawHttpResponse): SetCookieValue[]
  getResponseHeaders(response: RawHttpResponse, descriptors?: ResponseHeadersParameters): any
  getResponseBody(response: RawHttpResponse, validators?: ResponseBodyValidators): any
}

export type RunnableOperation<Request, Response> = {
  run(request: Request): Promise<Response>
}

export type ServerAdapter<T> = {
  getPathParameters<P>(toolkit: T, descriptor: any): Promise<Try<P>>
  getQueryParameters<Q>(toolkit: T, descriptor: any): Promise<Try<Q>>
  getCookieParameters<C>(toolkit: T, descriptor: any): Promise<Try<C>>
  getRequestHeaders<H>(toolkit: T, descriptor: any): Promise<Try<H>>
  getMimeType<M extends string>(toolkit: T): Promise<M>
  getRequestBody<M extends string, B>(toolkit: T, required: boolean, mimeType: M | undefined, validator: RequestBodyValidators<M>): Promise<Try<B>>

  getStatusCode(toolkit: T, resp: HttpResponse): Promise<number>
  getResponseBody(toolkit: T, resp: HttpResponse): Promise<any>
  getPreflightCorsHeaders(toolkit: T, method: HttpMethod | undefined, cors: OperationCorsConfiguration | undefined): Promise<RawHttpHeaders>
  getCorsHeaders(toolkit: T, cors: OperationCorsConfiguration | undefined): Promise<RawHttpHeaders>
  getAccessControlRequestedMethod(toolkit: T): HttpMethod | undefined
  getResponseHeaders(toolkit: T, resp: HttpResponse, serializer?: ResponseHeadersParameters, corsHeaders?: RawHttpHeaders): Promise<RawHttpHeaders>
  getResponseCookies(toolkit: T, resp: HttpResponse): Promise<SetCookieValue[]>

  respond(toolkit: T, response: RawHttpResponse): Promise<void>
  handleError(toolkit: T, error: any): Promise<void>
}

export type CorsConfiguration = {
  readonly [path: string]: {
    readonly [method in HttpMethod]?: OperationCorsConfiguration
  }
}

export type OperationCorsConfiguration = {
  readonly allowedOrigins?: string[] | boolean
  readonly allowedRequestHeaders?: string[]
  readonly allowedResponseHeaders?: string[]
  readonly allowCredentials?: boolean
  readonly maxAge?: number
}

export type RequestBodyValidators<C extends string = string> = {
  [contentType in C]: Validator<any>
}

export type ResponseHeadersParameters<S extends string = string> = {
  [statusCode in S]: any
}

export type ResponseHeadersSerializer<S extends string = string> = {
  [statusCode in S]: (input: any) => Try<RawHttpHeaders>
}

export type ResponseHeadersDeserializers<S extends string = string> = {
  [statusCode in S]: (input: RawHttpHeaders) => Try<any>
}

export type ResponseBodyValidators = {
  [statusCode: string]: {
    [contentType: string]: Validator<any>
  }
}

/** Http methods which are possible to describe using OpenAPI spec. */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

/** Generic type representing a HTTP response */
export type HttpResponse<B = any, S = any, M = any, H = any> = {
  /** The parsed response body */
  body?: B
  /** The response status code */
  statusCode: S
  /** The mime type of the response */
  mimeType?: M
  /** The cookies in the response (Set-Cookie header) */
  cookies?: SetCookieValue[]
  /** The response headers */
  headers?: H
}

/**
 * Wraps a cookie value with all possible configuration.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
 */
export type SetCookieValue = CookieConfiguration & CookieValue

/**
 * Wraps a cookie value with all possible configuration.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
 */
export type TypedSetCookieValue<T> = CookieConfiguration & {
  /** The parsed value of the cookie */
  value: T
}

export type CookieValue = {
  /** The name of the cookie */
  name: string
  /** The raw value of the cookie */
  value: string
}

export type Cookies<T> = {
  [K in keyof T]: TypedSetCookieValue<T[K]>
}

export type CookieConfiguration = {
  /**
   * The expiration date of the cookie in UTC date format.
   * Use Date#toUTCString() or Date#toGMTString() to serialize a Date object to this format.
   */
  expires?: string
  /**
   * Maximum age (number of seconds) of the cookie.
   * If both maxAge and expires is present, maxAge has precedence.
   */
  maxAge?: number
  /**
   * Defines the host to which the cookie will be sent.
   */
  domain?: string
  /**
   * Indicates the path that must exist in the requested URL for the browser to send the Cookie header.
   */
  path?: string
  /**
   * Indicates that the cookie is sent to the server only when a request is made with the https scheme (except on localhost)
   */
  secure?: boolean
  /**
   * Forbids JavaScript from accessing the cookie
   */
  httpOnly?: boolean
  /**
   * Controls whether or not a cookie is sent with cross-site requests
   */
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/** Http headers where key is the header name, value is the serialized header value. */
export type RawHttpHeaders = Record<string, string>

/** Object describing a Http request in a neutral format. */
export type RawHttpRequest = {
  /** Full url with path, and query. */
  url: string
  method: HttpMethod
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
}

/** Object describing a Http request in a neutral format. */
export type RawHttpResponse = {
  /** The response status code */
  statusCode?: number
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
  /** Cookies with optional parameters, and serialized name & value */
  cookies?: SetCookieValue[]
}

export type StatusCode1XX = 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199

export type StatusCode2XX = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255 | 256 | 257 | 258 | 259 | 260 | 261 | 262 | 263 | 264 | 265 | 266 | 267 | 268 | 269 | 270 | 271 | 272 | 273 | 274 | 275 | 276 | 277 | 278 | 279 | 280 | 281 | 282 | 283 | 284 | 285 | 286 | 287 | 288 | 289 | 290 | 291 | 292 | 293 | 294 | 295 | 296 | 297 | 298 | 299

export type StatusCode3XX = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 326 | 327 | 328 | 329 | 330 | 331 | 332 | 333 | 334 | 335 | 336 | 337 | 338 | 339 | 340 | 341 | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352 | 353 | 354 | 355 | 356 | 357 | 358 | 359 | 360 | 361 | 362 | 363 | 364 | 365 | 366 | 367 | 368 | 369 | 370 | 371 | 372 | 373 | 374 | 375 | 376 | 377 | 378 | 379 | 380 | 381 | 382 | 383 | 384 | 385 | 386 | 387 | 388 | 389 | 390 | 391 | 392 | 393 | 394 | 395 | 396 | 397 | 398 | 399

export type StatusCode4XX = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 427 | 428 | 429 | 430 | 431 | 432 | 433 | 434 | 435 | 436 | 437 | 438 | 439 | 440 | 441 | 442 | 443 | 444 | 445 | 446 | 447 | 448 | 449 | 450 | 451 | 452 | 453 | 454 | 455 | 456 | 457 | 458 | 459 | 460 | 461 | 462 | 463 | 464 | 465 | 466 | 467 | 468 | 469 | 470 | 471 | 472 | 473 | 474 | 475 | 476 | 477 | 478 | 479 | 480 | 481 | 482 | 483 | 484 | 485 | 486 | 487 | 488 | 489 | 490 | 491 | 492 | 493 | 494 | 495 | 496 | 497 | 498 | 499

export type StatusCode5XX = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511 | 512 | 513 | 514 | 515 | 516 | 517 | 518 | 519 | 520 | 521 | 522 | 523 | 524 | 525 | 526 | 527 | 528 | 529 | 530 | 531 | 532 | 533 | 534 | 535 | 536 | 537 | 538 | 539 | 540 | 541 | 542 | 543 | 544 | 545 | 546 | 547 | 548 | 549 | 550 | 551 | 552 | 553 | 554 | 555 | 556 | 557 | 558 | 559 | 560 | 561 | 562 | 563 | 564 | 565 | 566 | 567 | 568 | 569 | 570 | 571 | 572 | 573 | 574 | 575 | 576 | 577 | 578 | 579 | 580 | 581 | 582 | 583 | 584 | 585 | 586 | 587 | 588 | 589 | 590 | 591 | 592 | 593 | 594 | 595 | 596 | 597 | 598 | 599
