.PHONY: build
build:
	sass style.scss style.css
	pandoc --template template.pandoc \
		--from markdown+smart \
		--to html \
		--css style.css \
		--standalone \
		-o index.html \
		index.md

.PHONY: watch
watch:
	@fswatch -e ".*" -i index.md -i style.scss . \
	| xargs -n1 -I{} sh -c '\
		echo "[yellow]Rebuilding..." | icolor; \
		make build; \
		echo "[yellow]Reloading page..." | icolor; \
		osascript -e "tell application \"Google Chrome\" to tell the active tab of its first window to reload"'

.PHONY: serve
serve:
	@echo "[yellow]Starting server..." | icolor
	@serve

default: build
