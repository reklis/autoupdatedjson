# autoupdatedjson [![Build Status](https://secure.travis-ci.org/sfusco/autoupdatedjson.png?branch=master)](http://travis-ci.org/sfusco/autoupdatedjson)

when all you need is a json file hot loaded into memory when the file changes.


- You have some hard coded json in your javascript, you want to move it to a file.
- You know if you move it to a file, you'll have to read from the disk every time, and you know that's bad.
- You know that if you create a watcher, that is better because it will only have to watch for changes and parse and read only when needed
- You are too lazy to make a wrapper class for fs.watch + fs.read and/or busy doing other things


## Getting Started
Install the module with: `npm install autoupdatedjson`

```javascript


var auj = require('autoupdatedjson');



// register ./test/configfile.json to the configfile key

auj.set('configfile', path.join(process.cwd(), 'test', 'configfile.json'));


// get the data for 'configfile'

auj.get('configfile', function (configfile) {

  console.dir(configfile);

  {
    error: hopefully null
    data: { ... parsed file contents ... },
    meta: {
      last_updated: Date object of the last time configfile.data was parsed
    },
    watcher: fs watcher being used
  }

});

// call get(key, fn) as often as you like, the watcher will keep 'configfile' updated
// will only dip to file i/o and parse when it needs to instead of parsing every time


// when you are done

configfile.watcher.close();


```

## License
MIT