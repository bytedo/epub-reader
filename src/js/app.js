/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
import '/lib/scroll/index.js'

import layer from '/lib/layer/index.js'

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
    cates: [{ name: '默认分类', num: 12 }],
    books: [],
    loading: false,
    isDragIn: false,
    load: {
      num: 0,
      curr: 0
    },
    $db: {}
  },

  watch: {},

  mounted() {
    $doc.bind('dragover', ev => {
      ev.preventDefault()

      this.isDragIn = true
    })
    Anot(this.$refs.mask).bind('dragleave', ev => {
      ev.stopPropagation()
      ev.preventDefault()
      this.isDragIn = false
    })

    $doc.bind('drop', ev => {
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

        if (res) {
          this.books.push(res)
        }
      }

      this.loading = false
    })

    let db = app.dispatch('get-books')
    let cates = [],
      books
    for (let k in db) {
      cates.push({ name: k, num: db[k].length })
      // 默认选中第一个
      if (!books) {
        this.curr = k
        books = db[k]
      }
    }
    // books = books.concat(books, books, books, books, books, books)
    this.$db = db
    this.cates = cates
    this.books = books
  },
  methods: {}
})
