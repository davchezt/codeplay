// 1. Declarations and Node Modules Import
const electron = require('electron')
const path = require('path')
const shell = electron.shell
const remote = electron.remote
const fs = require('fs')
const {
  dialog,
  Menu,
  MenuItem
} = remote
const loader = require('monaco-loader');
const VIEW = require('./viewMenu')
const HELP = require('./helpMenu')
const SHORTCUT = require('./shortcuts')
const WINDOW = require('./windowControl')
const JSMenu = require('./scripts')
const CSSMenu = require('./styles')
const FILE = require('./fileMenu')

var scripts = ''
var styles = ''
var currentEditor
var editor = []
var output, html, css, js, editorLabels
var saveFlag = false
var styFlags = [0, 0, 0]
var scrFlags = [0, 0, 0, 0, 0]

var cssLib = [
  ['animate.css', "<link rel='stylesheet' type='text/css' href='lib/animate.css'>"],
  ['bootstrap.min.css', "<link rel='stylesheet' type='text/css' href='lib/bootstrap.min.css'>"],
  ['font-awesome.min.css', "<link rel='stylesheet' type='text/css' href='lib/font-awesome.min.css'>"]
]

var jsLib = [
  ['jquery-3.1.1.min.js', "<script src='lib/jquery-3.1.1.min.js'></script>"],
  ['anime.min.js', "<script src='lib/anime.min.js'></script>"],
  ['bootstrap.bundle.min.js', "<script src='lib/bootstrap.bundle.min.js'></script>"],
  ['bootstrap.min.js', "<script src='lib/bootstrap.min.js'></script>"],
  ['p5.min.js', "<script src='lib/p5.min.js'></script>"],
  ['three.min.js', "<script src='lib/three.min.js'></script>"]
]

// 3. Main Functions for Electron
onload = function () {
  WINDOW.initContextMenu()
  WINDOW.windowClicks()
  
  loader().then((monaco) => {
    editor[0] = monaco.editor.create(document.getElementById('html-editor'), {
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      rerenderIndentGuides: true,
      renderLineHighlight: 'all',
      tabSize: 2,
      scrollbar: {
        useShadows: true,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: 'auto',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        arrowSize: 10
      }
    })
    editor[1] = monaco.editor.create(document.getElementById('css-editor'), {
      language: 'css',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      rerenderIndentGuides: true,
      renderLineHighlight: 'all',
      tabSize: 2,
      scrollbar: {
        useShadows: true,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: 'auto',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        arrowSize: 10
      }
    })
    editor[2] = monaco.editor.create(document.getElementById('js-editor'), {
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      rerenderIndentGuides: true,
      renderLineHighlight: 'all',
      tabSize: 2,
      scrollbar: {
        useShadows: true,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: 'auto',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        arrowSize: 10
      }
    })

    html = editor[0]
    css = editor[1]
    js = editor[2]

    for (var k = 0; k < 3; k++) {
      editor[k].onDidChangeModelContent(() => {
        paint()
      })
    }
  
    html.onDidFocusEditorText(() => {
      changeEditor(html)
    })
    css.onDidFocusEditorText(() => {
      changeEditor(css)
    })
    js.onDidFocusEditorText(() => {
      changeEditor(js)
    })
  })

  // Output refresh and editor focus
  output = document.getElementById('output')
  editorLabels = document.getElementsByClassName('editor-label')

  FILE.fileMenu()
  VIEW.viewMenu()
  HELP.helpMenu()
  JSMenu.addScript()
  CSSMenu.addStyle()
  SHORTCUT.shortcuts()
  FILE.newFile()
  onresize()
}

// 5. Editor Functions
const getScr = () => scripts
const getSty = () => styles
const getCurrenEditor = () => {
  return currentEditor
}

function toggleEditors(editorI) {
  if (editorI === html) {
    css.focus()
  }
  if (editorI === css) {
    js.focus()
  }
  if (editorI === js) {
    html.focus()
  }
}

function removeFocus(editor) {
  for (var i = 0; i < editor.length; i++) {
    editor[i].classList.remove('editor-focus')
  }
}
// 6. Save the snippet functions
function toggleStatus(i, span) {
  if (span[i].classList.contains('status-active')) {
    span[i].classList.remove('status-active')
  } else {
    span[i].classList.add('status-active')
  }
}

// Refresh on resize
onresize = function () {
  for (var i = 0; i < 3; i++) {
    // editor[i].refresh()
  }
}

function paint() {
  output.srcdoc = '<html>' + '<head>' + getSty() + '<style>' + 'body{border:0;padding:0}' + css.getValue() + '</style>' + '</head>' + '<body>' + html.getValue() + getScr() + '<script>' + js.getValue() + '</script>' + '</body>' + '</html>'
}

function changeEditor(editor) {
    removeFocus(editorLabels)
    if(editor == html)
    {
      editorLabels[0].classList.add('editor-focus')
      currentEditor = html
    }
    if(editor == css)
    {
      editorLabels[1].classList.add('editor-focus')
      currentEditor = css
    }
    if(editor == js)
    {
      editorLabels[2].classList.add('editor-focus')
      currentEditor = js
    }
}