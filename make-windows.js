const electronInstaller = require('electron-winstaller');
async function winInstallerMake(){
    try {
        await electronInstaller.createWindowsInstaller({
          appDirectory: './release-builds/emok-elec-task-win32-x64',
          outputDirectory: './release-builds/maked',
          authors: 'My App Inc.',
          exe: 'myapp.exe'
        });
        console.log('It worked!');
      } catch (e) {
        console.log(`No dice: ${e.message}`);
      }
}

winInstallerMake().then(any=>{
    console.log(any);
}).catch((e)=>{
    console.log(e);
})