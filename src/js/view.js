/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:53:05
 */

import '/lib/anot.js'

import '/lib/scroll/index.js'
import '/lib/code/index.js'
import layer from '/lib/layer/index.js'
import fetch from '/lib/fetch/index.js'
import app from '/lib/socket.js'

Anot({
  $id: 'app',
  state: {
    toc: [],
    title: 'HTML5 canvas开发详解(第2版) (无)',
    curr: '',
    file: '',
    chapter: ''
  },
  mounted() {
    // app.on('float-visible', data => {})

    document.title = this.title
    this.getToc()
  },
  methods: {
    getToc() {
      fetch('book://cache/HTML5 canvas开发详解(第2版) (无)/toc.json')
        .then(r => r.json())
        .then(list => {
          for (let it of list) {
            delete it.id
            delete it.order
          }
          this.toc = list

          this.viewChapter(list[23])
        })
    },

    viewChapter(item) {
      let pathes = item.href.split('#')
      let file = pathes.shift()
      let hash = pathes.shift()

      this.curr = item.title

      if (this.file === file) {
        if (hash) {
          location.hash = hash
        } else {
          location.hash = ''
          this.$refs.chapter.scrollTop = 0
        }
      } else {
        this.file = file
        fetch('book://cache/HTML5 canvas开发详解(第2版) (无)/' + file)
          .then(r => r.text())
          .then(txt => {
            this.chapter = txt.replace(
              /<img[^>]*?src="(.*?)"[^>]*?\/?>/g,
              (m, s1) => {
                s1 = s1.replace('../', '')
                return `<img src="book://cache/${this.title}/${s1}">`
              }
            )

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
