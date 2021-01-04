/**
 * 进程通讯交互
 * @author yutent<yutent.io@gmail.com>
 * @date 2021/01/04 14:58:46
 */

const { ipcMain, net } = require('electron')

function fetch(url) {
  return new Promise((y, n) => {
    var conn = net.request(url)
    var r = []

    conn.on('response', res => {
      res.on('data', c => {
        r.push(c)
      })

      res.on('end', _ => {
        y(Buffer.concat(r).toString())
      })
    })

    conn.on('error', e => {
      n(e)
    })

    conn.end()
  })
}

module.exports = function(app) {
  ipcMain.on('app', (ev, conn) => {
    switch (conn.type) {
      case 'fetch':
        fetch(conn.data).then(r => {
          ev.returnValue = r
        })
        break

      case 'parse-book':
        break
    }
  })
}
