rm -rf ./public
rm README-API.md
apidoc -i ./ -o public
apidoc-markdown2 -p ./public -o README-API.md