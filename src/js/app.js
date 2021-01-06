/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
import '/lib/form/button.js'
import '/lib/form/switch.js'
import '/lib/scroll/index.js'
import '/lib/chart/rank.js'
import '/lib/chart/line.js'

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'

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
    }
  },

  watch: {},

  mounted() {
    $doc.bind('dragover', ev => {
      ev.stopPropagation()
      ev.preventDefault()

      this.isDragIn = true
    })
    Anot(this.$refs.mask).bind('dragleave', ev => {
      ev.stopPropagation()
      ev.preventDefault()
      this.isDragIn = false
    })

    $doc.bind('drop', ev => {
      ev.stopPropagation()
      ev.preventDefault()
      // clearTimeout(this.timer)
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

      console.time(1)
      while (this.load.curr < this.load.num) {
        this.load.curr++
        let book = files.pop()
        let res = app.dispatch('parse-book', { book, cate: this.curr })
        console.log(res)
        if (res) {
          this.books.push(res)
        }
      }
      console.timeEnd(1)

      this.loading = false
    })
  },
  methods: {}
})
