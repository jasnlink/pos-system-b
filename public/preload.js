const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        call: async (channel, data) => {
            return await ipcRenderer.invoke(channel, data);
        },
        reply: async (channel, callback) => {
            return await ipcRenderer.once(channel, callback)
        },
    }
);