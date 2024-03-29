# If not running interactively, don't do anything
[[ $- != *i* ]] && return

zsh_syntax_highlighting=/usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
[[ -f "$zsh_syntax_highlighting" ]] && source "$zsh_syntax_highlighting"

# Enable command completion & colored prompt
autoload -U compinit promptinit colors
compinit
promptinit
colors

# oh-my-zsh
export ZSH="/users/t/.oh-my-zsh"
plugins=(
  # git
)
[ -d "$ZSH" ] && source $ZSH/oh-my-zsh.sh

#PROMPT="%{$fg_bold[black]%(! $fg[red] )─$fg_bold[black]%(1j $fg[green] )─$fg_bold[black]%(?  $fg[red])─$reset_color%} "
PROMPT="%(?.;.%F{red};%f) "
#PROMPT="%1d%% "
RPROMPT=""

#setopt AUTO_CD
setopt completealiases
setopt append_history
setopt hist_verify
setopt hist_ignore_dups
setopt hist_ignore_space

bindkey "^[[1;3C" forward-word
bindkey "^[[1;3D" backward-word

#export PATH=$PATH:~/bin:
#export EDITOR=vim

test -f ~/.sh.d/aliases && source ~/.sh.d/aliases
if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi

autoload -U +X bashcompinit && bashcompinit
complete -o nospace -C /usr/local/bin/vault vault
