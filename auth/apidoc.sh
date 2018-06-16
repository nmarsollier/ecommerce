rm -rf ./dist/public
rm README-API.md
apidoc -i src -o ./dist/public
apidoc-markdown2 -p ./dist/public -o README-API.md