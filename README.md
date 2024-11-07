![banner](./images/marquee.png)

![screenshot](./images/screenshot-legacy.png)

[Release notes](./releaseNotes.md)

Install on:

- [Chrome](https://chromewebstore.google.com/detail/suttacentral-enhancement/lfkeephdohbmmbinhckfdeoajdbbkian)
- [FireFox](https://addons.mozilla.org/en-US/firefox/addon/suttacentral-enhancements/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/suttacentral-enhancement-/pcfibmblmflmdhdaaeojhldgcandgdob)

# Development

All of the instructions below are only needed if you plan on working on coding the extension. If you simplly want to use the plugin, choose your browser from the links above.

## installing

After opening your local clone of the repository:

```
pnpm i
```

That should install all the dependencies. If you don't have pnpm installed, [here](https://pnpm.io/installation) are the official instructions.

## Start server

### Chrome

```
pnpm dev
```

### FireFox

```
pnpm dev -b firefox
```

## Create package

### Chrome

```
pnpm zip
```

### Firefox

```
pnpm zip -b firefox
```

zipped packages can be found in `.output`

# packages used

- qr code generator: https://www.npmjs.com/package/qr-creator
