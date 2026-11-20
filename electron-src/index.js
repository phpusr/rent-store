const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
const isProduction = process.env.NODE_ENV === 'production'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  const bundledIndex = path.join(__dirname, 'browser', 'index.html')
  const localIndex = path.resolve(__dirname, '../dist/rent-store/browser/index.html')
  win.loadFile(fs.existsSync(bundledIndex) ? bundledIndex : localIndex)

  // Open the DevTools
  if (!isProduction) {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
