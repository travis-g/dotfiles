source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Enable command completion & colored prompt
autoload -U compinit promptinit colors
compinit
promptinit
colors

PROMPT="%{$fg_bold[black]%(! $fg[red] )─$fg_bold[black]%(1j $fg[green] )─$fg_bold[black]%(?  $fg[red])─$reset_color%} "
RPROMPT=""

#setopt AUTO_CD
setopt completealiases
setopt append_history
setopt hist_verify
setopt hist_ignore_all_dups

#export PATH=$PATH:~/bin:
#export EDITOR=vim

test -f ~/.sh.d/aliases && source ~/.sh.d/aliases
