//=========
//# importing modules
const { app, BrowserWindow, ipcMain } = require("electron");
//| NB app controls your application's event lifecycle
//| NB BrowserWindow creates and manages app windows

const path = require("path");

//=========
//# write a reusable function to instantiate windows
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //| NB in order to attach the preload.js script to the renderer process,
    //| you need to pass the path of the preload script to the
    //| webPreferences.preload option in the BrowserWindow constructor
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    //| NB-1 __dirname string points to the path of the currently executing script (in this case, your project's root folder).
    //| NB-2 The path.join API joins multiple path segments together, creating a
    //| combined path string that works across all platforms
  });

  //| NB set up handle listener in the main process BEFORE loading the HTML file,
  //| so that the handler is guaranteed to be ready before you send out the invoke call from the renderer
  ipcMain.handle("ping", () => "pong");

  //| load the HTML file
  win.loadFile("index.html");
};
//| NB the createWindow() function loads your web page into a bew BrowserWindow
//| instance (index.html is your web page)

//=========
//# call your function when the app is ready
app.whenReady().then(() => {
  createWindow();

  //======
  //# open a window if none are open
  //| macOS apps continue running even without any windows open
  //| activating the app when no windows are available, should open a new window
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//| app module --> is one of Electron's core modules that are NodeJS event emitters
//| and they adhere to NodeJS async event-driven architecture
//| in Electron BrowserWindows can only be created after the app module "ready" event is fired
//| you can wait for this event with app.whenReady() API calling createWindow()
//| once its promise is fulfilled

//| IMPORTANT
//| Each web page your app displays in a window will run in a separate process
//| called a renderer process.
//| Renderer processes have access to the same JavaScript APIs and tooling
//| you use for typical front-end web development, such as using webpack
//| to bundle and minify your code or React to build your user interfaces.

//=======
//# quit the app when all windows are closed
//| on windows and linux closing all windows will quit an application entirely
app.on("window-all-closed", () => {
  //| exit your app if the user is not on macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});
