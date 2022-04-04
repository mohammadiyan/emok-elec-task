const {app,BrowserWindow ,Menu,ipcMain} = require('electron');
if(require('electron-squirrel-startup')) app.quit();
const {join} = require('path');
const getSys = require('./lib/getSystemInfo.func').getSys;
const getAllProcesses = require('./lib/getProcesses.func').getAllProcesses
const killp = require('./lib/getProcesses.func').killp
let window;
const template = []
function createEmokWindow(){
    window = new BrowserWindow({
        
        show:false,
        frame:true,
        height:800,
        width:600,
        closable:true,
        icon:'',
        maxWidth:800,
        maxHeight:600,
        minWidth:800,
        minHeight:600,
        movable:true,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        },
        nativeWindowOpen: true
    })
    // window.webContents.openDevTools()
    window.loadFile(join(__dirname, 'html/index.html'));
    // window.loadURL('http://localhost:4200');
    window.webContents.once('dom-ready', () => {
        window.show()        
    })
}

app.on('ready',()=>{
    createEmokWindow();
    const mainMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(mainMenu)
})

ipcMain.on('info',(ev)=>{
    const info = {
        name : getSys('platform'),
        arch : getSys('arch'),
        cpus : getSys('cpus').length,
        totalRam: ((((getSys('totalmem'))/1024)/1024)/1024).toFixed(2),
        freeRam : ((((getSys('freemem'))/1024)/1024)/1024).toFixed(2),
        host : getSys('hostname')
    }
    window.webContents.send('info',info)
})

ipcMain.on('getProcess',async(ev)=>{
    const info = await getAllProcesses();
    window.webContents.send('getProcess',info)
})

ipcMain.on('kill',async(ev,id)=>{
    const killed = await killp(id);
    window.webContents.send('kill',killed)
})

