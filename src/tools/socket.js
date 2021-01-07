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
const DB_FILE = path.join(HOME, 'app.cache')
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

      case 'get-books':
        ev.returnValue = JSON.parse(fs.cat(DB_FILE))
        break

      case 'parse-book':
        let { book, cate } = conn.data
        let eb = new Epub(book.path)
        let cache = JSON.parse(fs.cat(DB_FILE))

        eb.on('end', async _ => {
          let { title } = eb.metadata
          let cover = 'cover'
          let dir = path.join(CACHE_DIR, title)

          function saveImage(id, name) {
            return new Promise(done => {
              eb.getImage(id, (err, buf) => {
                fs.echo(buf, path.join(dir, name))
                done()
              })
            })
          }

          function saveHtml(id, name) {
            return new Promise(done => {
              eb.getChapterRaw(id, (err, txt) => {
                let m = (txt + '').match(/<body[^>]*?>([\w\W]+)<\/body>/)
                if (m) {
                  let htm = m[1]
                    .replace(
                      /<(?!img|image)([\w\-]+)[^>]*?( id="[^\s]*?")?[^>]*?>/g,
                      '<$1$2>'
                    )
                    .replace(/<pre><code>/g, '<wc-code>')
                    .replace(/<\/code><\/pre>/g, '</wc-code>')

                  fs.echo(htm, path.join(dir, name.replace('.xhtml', '.html')))
                } else {
                  console.log(id, name, txt)
                }
                done()
              })
            })
          }

          loop: for (let k in eb.manifest) {
            let it = eb.manifest[k]

            switch (it['media-type']) {
              case 'text/css':
                continue loop
                break

              case 'application/x-dtbncx+xml':
                fs.echo(JSON.stringify(eb.toc), path.join(dir, 'toc.json'))
                break

              case 'application/xhtml+xml':
                await saveHtml(it.id, it.href)
                break

              default:
                if (it['media-type'].startsWith('image')) {
                  saveImage(it.id, it.href)
                  if (it.href.includes(cover)) {
                    cover = it.href
                  }
                }
                break
            }
          }

          let info = { title, cover }
          if (cache[cate]) {
            if (!cache[cate].some(it => it.title === title)) {
              cache[cate].push(info)
            } else {
              info = null
            }
          } else {
            cache[cate] = [info]
          }
          fs.echo(JSON.stringify(cache), DB_FILE)
          ev.returnValue = info
        })

        eb.parse()
        break
    }
  })
}
