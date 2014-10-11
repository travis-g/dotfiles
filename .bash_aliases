# ALIASES ----------------------------------------

# Color dir contents:
alias ls='ls --color=auto'
alias dir='dir --color=auto'
alias grep='grep --color=auto'
alias egrep='grep --color=auto'
alias fgrep='grep --color=auto'

# Package commands:
alias inst='yaourt'		# prev 'sudo powerpill -S'
alias search='yaourt'		# prev 'pacman -Ss'
alias remove='sudo pacman -Rns'

alias git='hub'

export EDITOR=vim

# OTHER ------------------------------------------

# Custom nav prompt
PS1='» '

# Make ~/bin files executeable
export PATH=$PATH:~/bin
