# routes-files-builder

## Usage

To install please run:
```
npm i -D routes-files-builder
```

The library can be used in .js or .ts files. The main point is to use it in the root folder of the project.

### Typescript usage

Create file routes-files-builder.ts with next code:

```
import { start } from 'routes-files-builder'
start();
```

And then inside the `package.json` add next script:

```
nodemon routes-files-builder.ts
```

Please check info about [nodemon](https://www.npmjs.com/package/nodemon), if you have no idea about it.

>Warning

Also, you can see next error after running script:

```
Typescript: Cannot use import statement outside a module
```

Most possibly you have `tsconfig.json` in root folder with incorrect settings for this library.

There are 2 quick options in this case - **use Javascript version** or **remove/rename/change** `tsconfig.json`.

### Javascript usage 

Create file routes-files-builder.js with next code:

```
const builder = require('routes-files-builder');
builder.start();
```

And then inside the `package.json` add next script:

```
node routes-files-builder.js
```

I think, if you are here, you know what the **node** is.

## After running script

....