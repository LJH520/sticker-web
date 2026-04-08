// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onClientResponse = (response: any) => {
  console.log('onClientResponse', response)

  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onClientError = (error: any) => {
    console.log('onClientError', error)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onServerResponse = (response: any) => {
  console.log('onServerResponse', response)

  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onServerError = (error: any) => {
    console.log('onServerError', error)
}
