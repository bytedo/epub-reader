/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
import '/lib/scroll/index.js'

import '/lib/layer/index.js'
import Utils from '/lib/utils.js'
import { md5 } from '/lib/md5.js'

import app from '/lib/socket.js'

const $doc = Anot(document)
const log = console.log

function sleep(ms) {
  return new Promise(_ => setTimeout(_, ms))
}

Anot({
  $id: 'app',
  state: {
    input: '',
    curr: '默认分类',
    cates: [],
    books: [],
    loading: false,
    isDragIn: false,
    load: {
      num: 0,
      curr: 0
    },
    $db: {},
    $ctx1: null,
    $ctx2: null
  },

  mounted() {
    Utils.outside(this.$refs.ctx1, ev => {
      this.$refs.ctx1.close()
    })

    Utils.outside(this.$refs.ctx2, ev => {
      this.$refs.ctx2.close()
    })

    /* --------------------- */
    $doc.bind('dragover', ev => {
      ev.preventDefault()

      this.isDragIn = true
    })
    Anot(this.$refs.mask).bind('dragleave', ev => {
      ev.stopPropagation()
      ev.preventDefault()
      this.isDragIn = false
    })

    $doc.bind('drop', async ev => {
      ev.preventDefault()

      this.isDragIn = false

      let files = Array.from(ev.dataTransfer.files)
        .filter(it => it.type === 'application/epub+zip')
        .map(it => {
          let { name, path } = it
          name = name.replace(/\.epub$/, '')
          return { name, path }
        })

      this.load.num = files.length
      this.load.curr = 0
      this.loading = true

      while (this.load.curr < this.load.num) {
        this.load.curr++
        let book = files.pop()
        let res = app.dispatch('parse-book', { book, cate: this.curr })

        await sleep(500)

        if (res) {
          this.books.push(res)
        }
      }

      for (let it of this.cates) {
        if (it.name === this.curr) {
          it.num = this.books.length
          break
        }
      }
      this.loading = false
    })

    /* --------------------- */

    let db = app.dispatch('get-books')
    let cates = [],
      books

    if (Object.keys(db).length < 1) {
      db = { 默认分类: [] }
    }

    for (let k in db) {
      cates.push({ name: k, num: db[k].length })
      // 默认选中第一个
      if (!books) {
        this.curr = k
        books = db[k]
      }
    }

    this.$db = db
    this.cates = cates
    this.books = books || []
  },
  methods: {
    view(item) {
      this.books = this.$db[item.name]
    },
    read(item) {
      var params = { title: item.title }
      var readCache = Anot.ls(md5(item.title))

      if (readCache) {
        params.chapter = readCache
      }

      app.dispatch(
        'read',
        Buffer.from(JSON.stringify(params)).toString('base64')
      )
    },

    pickCtx1(item, ev) {
      this.$ctx1 = item
      ev.stopPropagation()

      let { pageX, pageY } = ev
      if (pageY + 70 > 600) {
        pageY -= 70
      }

      this.$refs.ctx1.close()

      Anot.nextTick(_ => {
        this.$refs.ctx1.moveTo({ left: pageX + 'px', top: pageY + 'px' })
        this.$refs.ctx1.show()
      })
    },

    pickCtx2(item, ev) {
      this.$ctx2 = item

      ev.stopPropagation()

      let { pageX, pageY } = ev
      if (pageY + 70 > 600) {
        pageY -= 70
      }

      this.$refs.ctx2.close()

      Anot.nextTick(_ => {
        this.$refs.ctx2.moveTo({ left: pageX + 'px', top: pageY + 'px' })
        this.$refs.ctx2.show()
      })
    },
    saveDB() {
      app.dispatch('save-books', Anot.deepCopy(this.$db))
    },

    deleteCate() {
      //
      this.$refs.ctx1.close()
      if (this.$ctx1) {
        let { name, num } = this.$ctx1

        if (num > 0) {
          return layer.toast(`${name} 下有书籍, 不可删除!`, 'error')
        }
        delete this.$db[name]
        this.cates.remove(this.$ctx1)
        this.saveDB()
      }
    },

    createCate() {
      this.$ctx1 = null
      this.$refs.ctx1.close()

      layer
        .prompt('请输入分类名', (val, done) => {
          if (val.trim()) {
            if (this.$db[val.trim()]) {
              return layer.toast('分类已存在, 请换个名字', 'error')
            }
            done()
          }
        })
        .then(v => {
          v = v.trim()
          this.$db[v] = []
          this.cates.push({ name: v, num: 0 })
          this.saveDB()
        })
        .catch(Anot.noop)
    },

    renameCate() {
      //
      this.$refs.ctx1.close()
      if (this.$ctx1) {
        let { name } = this.$ctx1

        layer
          .prompt(`请输入新的分类名(${name})`, (val, done) => {
            val = val.trim()
            if (val) {
              if (this.$db[val] || val === name) {
                return layer.toast('分类已存在, 请换个名字', 'error')
              }
              done()
            }
          })
          .then(v => {
            v = v.trim()
            this.$db[v] = this.$db[name]
            delete this.$db[name]
            this.$ctx1.name = v
            this.$ctx1 = null
            this.saveDB()
          })
          .catch(Anot.noop)
      }
    },

    deleteBook() {
      this.$refs.ctx2.close()
      if (this.$ctx2) {
        let { title } = this.$ctx2
        layer
          .confirm(`是否要删除[${title}]? 该操作不可逆!`)
          .then(r => {
            this.books.remove(this.$ctx2)
            this.$db[this.curr] = this.books

            for (let it of this.cates) {
              if (it.name === this.curr) {
                it.num = this.books.length
                break
              }
            }

            this.saveDB()
            app.dispatch('delete-book', title)
          })
          .catch(Anot.noop)
      }
    }

    // moveBook() {
    // this.$refs.ctx2.close()
    // if (this.$ctx2) {
    //   let { title } = this.$ctx2
    // }
    // }
  }
})
