# Electron React JS: develop a desktop application

resource: https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites

If you want a single-command boilerplate. use Electron Forge's https://www.electronforge.io/

## Step 1: Create a Minimal Electron Application from scratch
1. Initialize your npm project --> https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#initializing-your-npm-project
2. Run the Electron App --> https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#running-an-electron-app --> cfr *main.js*
3. Add debugging from VSCode --> https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#optional-debugging-from-vs-code ; more on debugging https://www.electronjs.org/docs/latest/tutorial/application-debugging and https://www.electronjs.org/docs/latest/tutorial/devtools-extension

#### Summary
Electron applications are set up using npm packages. The Electron executable should be installed in your project's devDependencies and can be run in development mode using a script in your package.json file.

The executable runs the JavaScript entry point found in the main property of your package.json. This file controls Electron's main process, which runs an instance of Node.js and is responsible for your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes.

Renderer processes (or renderers for short) are responsible for displaying graphical content. You can load a web page into a renderer by pointing it to either a web address or a local HTML file. Renderers behave very similarly to regular web pages and have access to the same web APIs.

## Step 2: Preload scripts
The preload script can be used to securely expose privileged APIa into the renderer process.

--> Electron's **main process** is a NodeJS environment that has full operating system access --> in addition to Electron modules, you can also access NodeJS builtins & any package installed via npm.
--> Electron's **renderer processes** run web pages and do not run NodeJS by default for security reasons.
--> in order to bridge together Electron's different process types together, we will use a special script called **preload script**.

a BrowserWindow preload script runs in a context that has access to both the HTML DOM and a limited saubset of NodeJS and Electron APIs --> NB from Electron 20 onwards, preload scripts are sandboxed by default and no longer have access to a full NodeJS environment --> i.e. this means that you have a polyfilled `require` function that only has access to a limited set of APIs (more info on Process Sandboxing here https://www.electronjs.org/docs/latest/tutorial/sandbox).

Preload scripts are injected before a web page loads in the renderer. To add features to your renderer that require privileged access, you can define global objects through the contextBridge API.

--> cfr *preload.js*

Set up the connection between the preload script and the main process with webPreferences:preload in main.js
--> now the renderer has access to the "versions" global (defined in preload.js) --> in the renderer, this variable can be accessed via `window.versions` or `versions`

--> create and cfr *renderer.js*

#### Communicating between processes
The *main process* and the *renderer process* have distinct responsibilities and are not interchangeable --> therefore it is not possible to access the NodeJS APIs directly from the renderer process, nor the HTML DOM from the main process.
The solution is to use Electron's `ipcMain` and `ipcRenderer` modules for inter-process communication (IPC).
To send a message from your web page to the main process, you can set up a main process handler with `ipcMain.handle` and then expose a function that calls `ipcRenderer.invoke` to trigger the handler in your preload script. To illustrate this, add a global function to the renderer called `ping()` that will return a string from the main process.

--> see *preload.js* *main.js* --> once you have the sender and the receiver set up, you can now send messages from the renderer to the main process through the "ping" channel you just defined
--> see *renderer.js*

More info on ipcRenderer and ipcMain modules --> https://www.electronjs.org/docs/latest/tutorial/ipc

#### Summary
A preload script contains code that runs before your web page is loaded into the browser window. It has access to both DOM APIs and Node.js environment, and is often used to expose privileged APIs to the renderer via the contextBridge API.

Because the main and renderer processes have very different responsibilities, Electron apps often use the preload script to set up inter-process communication (IPC) interfaces to pass arbitrary messages between the two kinds of processes.


## Step 3: Adding features and application complexity
From this starting point, you can generally progress in developing your app in two broad directions:

1. Adding complexity to your renderer process' web app code --> for this, Electron-specific resources are not necessary. Building a pretty to-do list in Electron is just pointing your Electron BrowserWindow to a pretty to-do list web app. Ultimately, you are building your renderer's UI using the same tools (HTML, CSS, JavaScript) that you would on the web. Therefore, Electron's docs will not go in-depth on how to use standard web tools.
2. Deeper integrations with the operating system and Node.js --> Electron also provides a rich set of tools that allow you to integrate with the desktop environment (e.g. creating tray icons, adding global shortcuts, displaying native menus). It also gives you all the power of a Node.js environment in the main process. This set of capabilities separates Electron applications from running a website in a browser tab, and are the focus of Electron's documentation.

# Step 4: Package and Distribute the Electron App to users using Electron Forge
cfr https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging