emulate bash
[[ -f ~/.bashrc ]] && source ~/.bashrc
emulate zsh


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

[[ -f ~/.sh.d/aliases ]] && source ~/.sh.d/aliases

if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi
if command -v direnv 1>/dev/null 2>&1; then
  eval "$(direnv hook zsh)"
fi

autoload -U +X bashcompinit && bashcompinit

if command -v jj 1>/dev/null 2>&1; then
  source <(COMPLETE=zsh jj)
fi

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# pnpm
export PNPM_HOME="/Users/t/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end
export PATH="/usr/local/opt/rustup/bin:$PATH"
