/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 14:57:49
 */

const { app, BrowserWindow } = require('electron')

/**
 * 应用主窗口
 */
exports.createMainWindow = function(icon) {
  var win = new BrowserWindow({
    title: 'E-pub Reader',
    width: 960,
    height: 540,
    resizable: false,
    maximizable: false,
    icon,
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      spellcheck: false
    },
    show: false
  })

  win.loadURL('app://local/index.html')

  win.on('ready-to-show', _ => {
    win.show()
    // win.openDevTools()
  })

  win.on('close', ev => {
    if (app.__view__) {
      ev.preventDefault()
      win.hide()
    }
  })

  return win
}

// 创建悬浮窗口
exports.createViewWindow = function(params) {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    // show: false,
    title: 'E-pub Reader',
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      spellcheck: false
    }
  })

  // win.openDevTools()

  win.loadURL('app://local/view.html?' + params)

  win.on('closed', ev => {
    app.__view__ = null
  })

  return win
}
