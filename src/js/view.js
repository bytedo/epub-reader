/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:53:05
 */

import '/lib/anot.js'

import '/lib/scroll/index.js'
import '/lib/code/index.js'
import { md5 } from '/lib/md5.js'
import fetch from '/lib/fetch/index.js'
import app from '/lib/socket.js'

const { dirname, join } = require('path')

Anot({
  $id: 'app',
  state: {
    toc: [],
    book: '', // 当前阅读的书名
    curr: '', // 当前选中的章节名
    file: '', // 章节所属的文件名
    chapter: '' // 章节渲染html文本
  },
  mounted() {
    var search = location.search

    if (search) {
      search = JSON.parse(Buffer.from(search.slice(1), 'base64'))

      document.title = this.book = search.title
      this.curr = search.chapter || ''

      this.getToc()
    }
  },
  methods: {
    getToc() {
      fetch(`book://cache/${this.book}/toc.json`)
        .then(r => r.json())
        .then(list => {
          let chapter, idx
          for (let i = -1, it; (it = list[++i]); ) {
            delete it.id
            delete it.order

            it.href = it.href.replace('.xhtml', '.html')

            if (it.title === this.curr) {
              chapter = it
              idx = i
            }
          }

          if (!chapter) {
            chapter = list[0]
            idx = 0
          }

          this.toc = list
          this.viewChapter(chapter)

          setTimeout(() => {
            this.$refs.toc.scrollTop = 36 * (idx - 10)
          }, 100)
        })
    },

    viewChapter(item) {
      let pathes = item.href.split('#')
      let file = pathes.shift()
      let hash = pathes.shift()

      this.curr = item.title

      Anot.ls(md5(this.book), item.title)

      if (this.file === file) {
        if (hash) {
          location.hash = hash
        } else {
          location.hash = ''
          this.$refs.chapter.scrollTop = 0
        }
      } else {
        this.file = file
        fetch(`book://cache/${this.book}/${file}`)
          .then(r => r.text())
          .then(txt => {
            this.chapter = txt
              .replace(/<img[^>]*?src="(.*?)"[^>]*?\/?>/g, (m, s1) => {
                s1 = join(dirname(file), s1)
                return `<img src="book://cache/${this.book}/${s1}">`
              })
              .replace(/<image[^>]*?xlink:href="(.*?)"[^>]*?\/?>/g, (m, s1) => {
                s1 = join(dirname(file), s1)
                return `<img class="cover" src="book://cache/${
                  this.book
                }/${s1}">`
              })
              .replace(/<\/?svg>/g, '')

            setTimeout(() => {
              if (hash) {
                location.hash = hash
              } else {
                location.hash = ''
                this.$refs.chapter.scrollTop = 0
              }
            }, 100)
          })
      }
    }
  }
})
