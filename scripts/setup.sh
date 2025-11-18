#!/usr/bin/env zsh

# Add Bun autocompletion to Oh My Zsh
mkdir -p $HOME/.oh-my-zsh/completions
SHELL=zsh bun completions zsh >$HOME/.oh-my-zsh/completions/_bun
{
    echo 'fpath+=($HOME/.oh-my-zsh/completions)'
    echo 'autoload -Uz compinit'
    echo 'compinit'
} >>"$HOME/.zshrc"
