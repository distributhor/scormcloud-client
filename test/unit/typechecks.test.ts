
import { TypeChecks } from '../../src/client'
// import { Options } from '../../src/types'

// function getScope(optionsOrScope?: string | Options): string | undefined {
//   if (!optionsOrScope) {
//     return undefined
//   }

//   if (typeof optionsOrScope === 'string') {
//     return optionsOrScope
//   }

//   return optionsOrScope?.scope
// }

describe('Type Check Tests', () => {
  test('Error Property', async () => {
    const e = {
      error: 'Example Error'
    }

    expect(TypeChecks.containsErrorProperty(e)).toEqual(true)

    const notE1 = {
      error: false
    }

    expect(TypeChecks.containsErrorProperty(notE1)).toEqual(false)

    const notE2 = {
      status: 404
    }

    expect(TypeChecks.containsErrorProperty(notE2)).toEqual(false)
  })

  test('Error Object', async () => {
    const e = {
      message: 'Example Error'
    }

    expect(TypeChecks.isErrorObject(e)).toEqual(true)

    const notE1 = {
      message: false
    }

    expect(TypeChecks.isErrorObject(notE1)).toEqual(false)

    const notE2 = {
      status: 404
    }

    expect(TypeChecks.isErrorObject(notE2)).toEqual(false)
  })

  test('Http Error', async () => {
    const e = {
      status: 404,
      response: {
        body: {
          error: 'NOT FOUND'
        },
        error: {
          message: 'Not Found',
          text: 'Not Found',
          status: 404
        }
      }
    }

    expect(TypeChecks.isHttpError(e)).toEqual(true)

    const notE1 = {
      status: 404,
      response: {
        body: {
          error: 'NOT FOUND'
        },
        error: false
      }
    }

    expect(TypeChecks.isHttpError(notE1)).toEqual(false)

    const notE2 = {
      status: 404,
      response: {
        body: {
          error: 'NOT FOUND'
        }
      }
    }

    expect(TypeChecks.isHttpError(notE2)).toEqual(false)
  })

  // test('Options', async () => {
  //   const options = {
  //     blah: 'BLAH',
  //     scope: 'admin'
  //   }

  //   console.log(options)
  //   console.log(getScope('blah'))
  //   console.log(getScope(options))
  //   console.log(getScope({ scopez: 'yo' }))
  //   console.log(getScope(undefined))

  //   expect(1).toEqual(1)
  // })
})
