" .vimrc

" GENERAL {{{
set mouse=
"set ttymouse=urxvt

set autoread
set autowrite

filetype indent on
" }}}

" BEHAVIOR {{{
" backup files, don't .swp
set noswapfile
set nowritebackup
set nobackup
set undofile
set undodir=$HOME/.vim/undo

set virtualedit=block

set tags+=~/.vim/systags
" }}}

" DISPLAY {{{
syntax on

set encoding=utf-8
set wildmenu
set modeline

set statusline=-
set laststatus=0 noruler " rulerformat=%-28(%=%M%H%R\ %t%<\ %l,%c%V%8(%)%P%)

set list lcs=tab:│\ ,nbsp:¬
set fillchars=vert:│,fold:-,stl:─,stlnc:┈
" }}}

" FORMATTING {{{
set smartindent     " smart indent
set et              " notabs
set sw=4            " shiftwidth
set sts=4           " softtabstop

set lbr             " enable line break
set sbr=>           " line break indicator

set splitright      " open vsplits on the right
set fdm=syntax      " set foldmethod
" }}}

" MAPPING {{{
" Treat broken lines separately
map j gj
map k gk

" }}}

" AUTOCOMMANDS {{{
au FileType         make set noet

set omnifunc=syntaxcomplete#Complete
au FileType c       set omnifunc=ccomplete#Complete
au FileType cpp     set omnifunc=ccomplete#Complete
au FileType html    set omnifunc=htmlcomplete#CompleteTags
au FileType css     set omnifunc=csscomplete#CompleteCSS
" }}}

" vim: set ts=4 sw=4 sts=4 tw=78 et fdm=marker:
