//= preload script --> it exposes your app's versions of Chrome, Node and Electron into the renderer
//| this script exposes selected properties of Electron's "process.versions" object to the renderer process in a "versions" global variable

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions

  ping: () => ipcRenderer.invoke("ping"),
  //| NB wrap the ipcRenderer.invoke("ping") call in a helper function rather than expose the ipcRenderer module
  //| directly via context bridge
  //| NB IMPORTANT never directly expose the entire ipcRenderer module via preload
  //| --> this would give your renderer the ability to send arbitrarily IPC messages to the main process,
  //| which becomes a powerful attack vector for malicious code
});
