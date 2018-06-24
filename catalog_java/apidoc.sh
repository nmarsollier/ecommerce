rm -rf resources/www
rm README-API.md
apidoc -i src -o resources/www
apidoc-markdown2 -p resources/www -o README-API.md
