var mute = require('./index')
var assert = require('assert')

describe('mute', function () {
  var called, org

  beforeEach(function () {
    org = process.stderr.write
    called = 0

    process.stderr.write = function () {
      called += 1
      org.apply(this, arguments)
    }
  })

  afterEach(function () {
    process.stderr.write = org
  })

  it('should handle promises (success)', function (done) {
    mute(function () {
      return new Promise(function (resolve) {
        process.stderr.write('')
        process.stderr.write('')
        process.stderr.write('')
        setImmediate(resolve)
      })
    }).then(function () {
      process.stderr.write('')
      process.stderr.write('')

      assert.equal(called, 2)
      done()
    }).catch(done)
  })

  it('should handle promises (failure)', function (done) {
    mute(function () {
      return new Promise(function (resolve, reject) {
        process.stderr.write('')
        process.stderr.write('')
        process.stderr.write('')
        setImmediate(reject, new Error('ETEST'))
      })
    }).then(function () {
      assert.ok(false)
    }).catch(function (err) {
      process.stderr.write('')
      process.stderr.write('')

      assert.equal(called, 2)
      assert.equal(err.message, 'ETEST')
      done()
    }).catch(done)
  })

  it('should handle simple functions', function () {
    var innerCalled = false

    mute(function () {
      process.stderr.write('')
      process.stderr.write('')
      process.stderr.write('')
      innerCalled = true
    })

    process.stderr.write('')
    process.stderr.write('')

    assert.equal(called, 2)
    assert.ok(innerCalled)
  })

  it('should handle callback functions', function (done) {
    mute(function (unmute) {
      process.stderr.write('')
      process.stderr.write('')

      setImmediate(function () {
        process.stderr.write('')
        process.stderr.write('')
        process.stderr.write('')

        unmute()

        process.stderr.write('')
        process.stderr.write('')
        process.stderr.write('')
        process.stderr.write('')

        assert.equal(called, 4)
        done()
      })
    })
  })
})
