
// This script minifies the css file in ../dist/quikchat.css 
// and writes the minified css to ../dist/quikchat.min.css

var CleanCSS = require('clean-css');
var fs = require('fs');

// get input css from ../dist/quikchat.css
var input = fs.readFileSync('./dist/quikchat.css', 'utf8');
var options = { /* options */ };
var output = new CleanCSS(options).minify(input);

//write output to file  ../dist/quikchat.min.css
let preamble = "/* QuikChat minified CSS */\n";
fs.writeFile('./dist/quikchat.min.css', preamble+output.styles, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("quikchat css minified: ./dist/quikchat.min.css");
});
