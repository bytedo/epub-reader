/**
 * 初始化
 * @author yutent<yutent.io@gmail.com>
 * @date 2021/01/05 10:02:02
 */

const { app } = require('electron')
const path = require('path')
const fs = require('iofs')

const HOME = path.resolve(app.getPath('userData'))

/* ********** 修复环境变量 start *********** */
let PATH_SET = new Set()
process.env.PATH.split(':').forEach(_ => {
  PATH_SET.add(_)
})
PATH_SET.add('/usr/local/bin')
PATH_SET.add('/usr/local/sbin')

process.env.PATH = Array.from(PATH_SET).join(':')
PATH_SET = null

/* ********** 修复环境变量 end *********** */

const INIT_FILE = path.join(HOME, 'app.cache')
const CACHE_DIR = path.join(HOME, 'book_cache')

if (!fs.exists(INIT_FILE)) {
  fs.echo('[]', INIT_FILE)
  fs.mkdir(CACHE_DIR)
}
