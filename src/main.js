/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2019/09/16 20:51:19
 */

const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const fs = require('iofs')

require('./tools/init')
const { createMainWindow, createFloatWindow } = require('./tools/window')
const createMenu = require('./tools/menu')
const Socket = require('./tools/socket')

const MIME_TYPES = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/plain',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/ico',
  all: 'text/*'
}

const ROOT = __dirname
const HOME = path.resolve(app.getPath('userData'))
const CACHE_DIR = path.join(HOME, 'book_cache')

var timer

/* ----------------------------------------------------- */
app.commandLine.appendSwitch('--lang', 'zh-CN')
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
  { scheme: 'book', privileges: { secure: true, standard: true } }
])

/* ----------------------------------------------------- */

// app.dock.hide()

//  初始化应用
app.once('ready', () => {
  // 注册协议
  protocol.registerStreamProtocol('app', function(req, cb) {
    var file = decodeURIComponent(req.url.replace(/^app:\/\/local\//, ''))
    var ext = path.extname(file)

    file = path.resolve(ROOT, file)

    cb({
      data: fs.origin.createReadStream(file),
      mimeType: MIME_TYPES[ext],
      headers: {
        'Cache-Control': 'max-age=144000000'
      }
    })
  })

  protocol.registerStreamProtocol('book', function(req, cb) {
    var file = decodeURIComponent(req.url.replace(/^book:[\/]+/, '/'))
    var ext = path.extname(file)

    file = path.resolve(CACHE_DIR, file)

    cb({
      data: fs.origin.createReadStream(file),
      mimeType: MIME_TYPES[ext] || MIME_TYPES.all,
      headers: {
        'Cache-Control': 'max-age=144000000'
      }
    })
  })

  // 创建浏览器窗口
  app.__main__ = createMainWindow(path.resolve(ROOT, './images/app.png'))
  // app.__float__ = createFloatWindow()

  createMenu(app.__main__)
  Socket(app)

  app.__main__.on('closed', () => {
    app.__main__ = null
    app.__float__ = null
    app.exit()
  })

  // mac专属事件, 点击dock栏图标, 可激活窗口
  app.on('activate', _ => {
    if (app.__main__) {
      app.__main__.restore()
    }
  })
})
