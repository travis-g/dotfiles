set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
"call vundle#begin('~/some/path/here')

" PLUGIN LIST START
Plugin 'gmarik/Vundle.vim'

Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'

" PLUGIN END
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on

" Brief help
" :PluginList       - lists configured plugins
" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
"
" see :h vundle for more details or wiki for FAQ
" VUNDLE CONFIG END

" Syntax highlighting
syntax on

" Enable mouse
set mouse=a
set ttymouse=urxvt

" Line numbers
"set number

" PLUGIN CONFIG
" vim-markdown
let g:vim_markdown_folding_disabled=1

" Syntax by filetype
augroup markdown
	au!
	au BufNewFile,BufRead *.md,*.markdown,*.ghmarkdown setlocal filetype=ghmarkdown
augroup END
