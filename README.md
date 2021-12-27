# Source Example Frame Plugin

This is an example iframe plugin for Source Health. It contains a simple node
backend that can parse and verify the Source application tokens (JWTs) and a
simple frontend that can be loaded as an iframe within Source.

# Local development

Run the backend in dev mode, with hot-reloading

```
npm run backend:dev
```

Build the frontend

```
npm run frontend:build
```

Load the dummy parent app in a browser e.g. http://localhost:3000/parent.html

TODO: hot-reload the frontend

TODO: how to run both of these in glitch?

## Typescript on Glitch

As you can see from package.json, we have defined our `npm run start` script to
do the following:

1. Build the frontend
2. Start the backend server with `ts-node`.

This will delay waking up the sleeping app, but it works well enough for a demo like this.

### Editing in Glitch

If you are using typescript on Glitch, you might notice that your changes do not
refresh the page. It seems that Glitch only listens for javascript files with
.js extensions.

We can work around that limitation by running this command in the Glitch
terminal when developing, to monitor your TS files, and automatically refresh
the app if need be.

```sh
npm run glitch:watch
```

Your typescript file will not be built by this watch command since the app uses
ts-node to directly run the typescript files.

This Glitch App was based on the
[glitch-ts-node](https://github.com/codiechanel/glitch-ts-node) starter app.
