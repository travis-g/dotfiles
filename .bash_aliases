# ALIASES ----------------------------------------

# Color dir contents:
alias ls='ls --color=auto'

# Package commands:
alias inst='yaourt'		# prev 'sudo powerpill -S'
alias search='yaourt'		# prev 'pacman -Ss'
alias remove='sudo pacman -Rns'

alias git='hub'

# Show ALL open ports
alias ports='sudo netstat -tulanp'

export EDITOR=vim

# OTHER ------------------------------------------

# Custom nav prompt
PS1='─── '

# Make ~/bin files executeable
export PATH=$PATH:~/bin
