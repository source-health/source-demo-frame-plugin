# Source Example Frame Plugin




## Typescript on Glitch

If you are using typescript on glitch, you might notice that your changes does not refresh page. 
It seems that glitch only listens for javascript files with .js extensions.

We can work around that limitation by running this command in the Glitch terminal when developing,
to monitor your TS files, and automatically refresh the app if need be.
```sh
npm run watch-server
```

Your typescript file will not be built by this watch command since the app uses ts-node to directly run 
the typescript files.

This Glitch App was based on the [glitch-ts-node](https://github.com/codiechanel/glitch-ts-node) starter app.