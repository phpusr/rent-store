SPACE=18

# src: https://gist.github.com/prwhite/8168133#gistcomment-2833138
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-${SPACE}s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Commands

build: ## Build
	@echo "=== Build ==="
	@npm install
	@npm run build
	@sed -i 's!<base href="/">!<base href="./">!' dist/rent-store/index.html
	@cd electron-src && cp index.js package*.json ../dist/rent-store
	@cd dist/rent-store && NODE_ENV=production npm install --omit=dev

package: ## Create Pacman package
	@echo "=== Creating Pacman package"
	@cd package && rm *.tar.gz; makepkg -f; updpkgsums && makepkg -srif

clean: ## Clean
	@echo "=== Clean ==="
	@rm -rf dist
