/**
 * 进程通讯交互
 * @author yutent<yutent.io@gmail.com>
 * @date 2021/01/04 14:58:46
 */

const { app, ipcMain, net } = require('electron')
const fs = require('iofs')
const path = require('path')
const Epub = require('epub')

const HOME = path.resolve(app.getPath('userData'))
const CACHE_DIR = path.join(HOME, 'book_cache')

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
        let books = conn.data
        let eb = new Epub(books[0].path)

        function saveImage(id, name) {
          return new Promise(done => {
            eb.getImage(id, (err, buf) => {
              fs.echo(buf, path.resolve(CACHE_DIR, name))
              done()
            })
          })
        }

        function saveHtml(id, name) {
          return new Promise(done => {
            eb.getChapter(id, (err, txt) => {
              txt = (txt + '').replace(/<([\w\-]+)[^>]*?>/g, '<$1>')
              fs.echo(txt, path.resolve(CACHE_DIR, name))
              done()
            })
          })
        }

        eb.on('end', async _ => {
          loop: for (let k in eb.manifest) {
            let it = eb.manifest[k]

            switch (it['media-type']) {
              case 'text/css':
                continue loop
                break

              case 'application/x-dtbncx+xml':
                fs.echo(
                  JSON.stringify(eb.toc),
                  path.resolve(CACHE_DIR, it.href)
                )
                break

              case 'application/xhtml+xml':
                await saveHtml(it.id, it.href)
                break

              default:
                if (it['media-type'].startsWith('image')) {
                  saveImage(it.id, it.href)
                }
                break
            }
          }
          ev.returnValue = [eb.manifest, eb.flow]
        })

        eb.parse()
        break
    }
  })
}
