# glitch-ts-node
If you are using glitch.com and use typescript, here's a starter package that might help

If you ar using typescript on glitch, you might notice that your changes does not refresh page. 
It seems that glitch only listens for javascript files with .js extensions.

My solution only requires one step. That you run in the console the following command:

npm run watch-server

this will monitor all files in the src folder with the ts/tsx extension and automatically refresh your app.

Your typescript file will not be built, no tsc command whatsoever because we are using ts-node which directly runs 
your typescript files.
