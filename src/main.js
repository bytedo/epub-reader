/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2019/09/16 20:51:19
 */

const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const fs = require('iofs')

const { createMainWindow, createFloatWindow } = require('./tools/window')
const createMenu = require('./tools/menu')
const Socket = require('./tools/socket')

const MIME_TYPES = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/plain',
  '.css': 'text/css',
  '.jpg': 'image/jpg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/ico'
}

const ROOT = __dirname

var timer

/* ----------------------------------------------------- */
app.commandLine.appendSwitch('--lang', 'zh-CN')
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/* ----------------------------------------------------- */

app.dock.hide()

//  初始化应用
app.once('ready', () => {
  // 注册协议
  protocol.registerBufferProtocol('app', (req, cb) => {
    let file = req.url.replace(/^app:\/\/local\//, '')
    let ext = path.extname(req.url)
    let buff = fs.cat(path.resolve(ROOT, file))
    cb({ data: buff, mimeType: MIME_TYPES[ext] })
  })

  // 创建浏览器窗口
  app.__main__ = createMainWindow(path.resolve(ROOT, './images/app.png'))
  app.__float__ = createFloatWindow()

  createMenu(app.__main__)
  Socket(app)

  app.__main__.on('closed', () => {
    app.__main__ = null
    app.__float__ = null
    app.exit()
  })

  // mac专属事件,点击dock栏图标,可激活窗口
  // app.on('activate', _ => {
  //   if (app.__main__) {
  //     app.__main__.restore()
  //   }
  // })
})
