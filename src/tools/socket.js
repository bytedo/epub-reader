/**
 * 进程通讯交互
 * @author yutent<yutent.io@gmail.com>
 * @date 2021/01/04 14:58:46
 */

const { app, ipcMain } = require('electron')
const fs = require('iofs')
const path = require('path')
const Epub = require('epub')

const HOME = path.resolve(app.getPath('userData'))
const DB_FILE = path.join(HOME, 'app.cache')
const CACHE_DIR = path.join(HOME, 'book_cache')

module.exports = function(app, createViewWindow) {
  ipcMain.on('app', (ev, conn) => {
    switch (conn.type) {
      case 'get-books':
        ev.returnValue = JSON.parse(fs.cat(DB_FILE))
        break

      case 'save-books':
        fs.echo(JSON.stringify(conn.data), DB_FILE)
        ev.returnValue = true
        break

      case 'read':
        let params = JSON.parse(Buffer.from(conn.data, 'base64'))
        if (app.__view__) {
          // 打开同一个文档, 直接忽略
          if (app.__view__.__title__ === params.title) {
            app.__view__.focus()
            ev.returnValue = true
            return
          }
          app.__view__.destroy()
        }
        app.__view__ = createViewWindow(conn.data)
        app.__view__.__title__ = params.title
        ev.returnValue = true
        break

      case 'delete-book':
        let dir = path.join(CACHE_DIR, conn.data)
        fs.rm(dir, true)
        ev.returnValue = true
        break

      case 'save-cover':
        let file = path.join(CACHE_DIR, conn.data.name, 'cover.webp')
        let buf = Buffer.from(conn.data.base64, 'base64')
        fs.echo(buf, file)
        ev.returnValue = true
        break

      case 'parse-book':
        let { book, cate } = conn.data
        let eb = new Epub(book.path)
        let cache = JSON.parse(fs.cat(DB_FILE))

        eb.on('end', async _ => {
          let { title } = eb.metadata
          let cover = ''
          let dir = path.join(CACHE_DIR, title)
          let dict = {}
          let toc = []

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

                  htm = htm
                    .replace(/<pre>/g, '<wc-code>')
                    .replace(/<\/pre>/g, '</wc-code>')

                  htm = htm
                    .replace(/<wc-code>([\w\W]*?)<\/wc-code>/g, function(m, s) {
                      s = s.replace(/<\/?\w+>/g, '')
                      return `<wc-code>${s}</wc-code>`
                    })
                    .trim()

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
                eb.toc.forEach(_ => {
                  dict[_.id] = _
                })

                break

              case 'application/xhtml+xml':
                await saveHtml(it.id, it.href)
                break

              default:
                if (it['media-type'].startsWith('image')) {
                  saveImage(it.id, it.href)
                  if (it.href.includes('cover')) {
                    cover = it.href
                  }
                }
                break
            }
          }

          toc = eb.flow.map((it, i) => {
            let tmp = dict[it.id] || { level: i === 0 ? i : undefined }
            if (tmp.level === undefined) {
              tmp.level = 1
            }
            if (it.id === 'titlepage') {
              it.level = 0
              it.title = '封面'
            } else {
              it.level = tmp.level
              let cp

              if (it.title) {
                cp = it.title
              } else {
                cp = fs
                  .cat(path.join(dir, it.href.replace('.xhtml', '.html')))
                  .toString()
                cp = cp.split(/[\r\n]/).shift()
                cp = cp.replace(/<\/?[\w\-]+[^>]*?>/g, '').trim()
              }

              it.title = cp
                .slice(0, 20)
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
            }
            return it
          })

          fs.echo(JSON.stringify(toc), path.join(dir, 'toc.json'))

          if (!cover) {
            cover = 'cover.webp'
            app.__main__.webContents.send('app', {
              type: 'draw-cover',
              data: title
            })
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
