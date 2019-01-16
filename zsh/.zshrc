source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Enable command completion & colored prompt
autoload -U compinit promptinit colors
compinit
promptinit
colors

# oh-my-zsh
export ZSH="/users/t/.oh-my-zsh"
plugins=(
  git
)
source $ZSH/oh-my-zsh.sh

#PROMPT="%{$fg_bold[black]%(! $fg[red] )─$fg_bold[black]%(1j $fg[green] )─$fg_bold[black]%(?  $fg[red])─$reset_color%} "
PROMPT="%1d%% "
RPROMPT=""

#setopt AUTO_CD
setopt completealiases
setopt append_history
setopt hist_verify
setopt hist_ignore_dups
setopt hist_ignore_space

#export PATH=$PATH:~/bin:
#export EDITOR=vim

test -f ~/.sh.d/aliases && source ~/.sh.d/aliases
