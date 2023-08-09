# Markdown Links
Check if you MD file has any links. It'll help you to see stats report and validate links found in your Markdown file.
[Developer for Laboratoria](https://github.com/Laboratoria/DEV007-md-links)

## How to use

Run in your terminal:
`mdlinks <path-to-file> [options]`

Then you'll see in the output details of all links found. Like this:
```sh
The file has the following links:
Link 1:
Text: Objetos en JavaScript
URL: https://curriculum.laboratoria.la/es/topics/javascript/05-objects/01-objects
```

You can see report stats and detaild of links found in your MD file. If you pass the [option] `--validate`, you'll see if the links works or not. 
For example, this is the way you'll see stats:
```sh
Link 2:
Text: Path
URL: https://nodejs.org/api/path.html
Status: 200
OK: Ok
```

Otherwise if you pass the [option] `--stats`, you'll see basic stats about your links. Like:
```sh
mdlinks <path-to-file> --stats
stats: { Total: 80, Unique: 75 }
```

And last, if you pass the [option] `--stats` and `--validate`, you'll see the sum of Total, Unique and Broken links.
```sh
stats and validate: { Total: 80, Unique: 75, Broken: 18 }
```