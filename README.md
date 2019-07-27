# Simple starter kit for React 16.8

Phoenix client written in React 16.8, with hooks only.

## Installation

$ mkdir client16_8
$ cd client16_8
$ yarn init -y

### Git

* Create .gitignore

$ vim .gitignore
/dist
/node_modules
npm-debug.log
yarn-error.log
.DS_Store

$ git init
$ git add .
$ git commit -m "Initial commit"

### Packages

$ yarn add react react-dom core-js phoenix

$ yarn add -D @babel/core @babel/preset-env @babel/preset-react babel-loader copy-webpack-plugin css-loader file-loader html-webpack-plugin mini-css-extract-plugin node-sass optimize-css-assets-webpack-plugin sass-loader uglifyjs-webpack-plugin url-loader webpack webpack-cli webpack-dev-server webpack-manifest-plugin

### Post install

$ mkdir src dist vendor static

* Create src/index.js
* Create src/index.html
* Create src/css/app.scss

* Update package.json to include scripts
* Create babel.config.js
* Create webpack.config.js

* Create static/fonts
* Add fonts...
* Create src/css/fonts.scss
* Create src/css/style.scss
* Import styles from src/css/app.scss

## Change :

* use dist instead of build

OBSOLETE! NO NEED TO RENAME THE TEMPLATE!
* Rename index.template to index.html.template

This use : 

* React 16.8 (introduce React Hooks)
* Babel 7 (introduce babel.config.js)
* Webpack 4

Hot reload modules
Split bundle et vendor
Ajout de core-js 3
Configuration de Babel avec : 
* babel.config.js

Après un essai infructueux, ne pas utiliser style-loader

https://github.com/danethurber/webpack-manifest-plugin/blob/1.x/README.md
Add webpack-manifest-plugin