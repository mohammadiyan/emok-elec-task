const { promisify } = require('util')
const { exec, execFile } = require('child_process')
const  getSys  = require('./getSystemInfo.func').getSys
const run = promisify(exec);
const exe = promisify(execFile);

const osType = getSys('platform');

async function getAllProcesses() {
    switch(osType){
        case 'win32':
            const objArr = await windows();
            return objArr
        break;
        case 'linux':
            const top = (await run('top -n 1 -b'));
            const jsonArray = MakeJsonArray(top.stdout);
            return jsonArray
        break;
        default:
            return [];
        break
    }
}

const windows = async () => {
    const data = await run('tasklist /nh',{
		maxBuffer: 1024 * 1024 *10,
		windowsHide: true,
	});
    const stdout = data.stdout;
    return stdout
        .trim()
        .split('\r\n')
        .map(line => line.split(' ').filter(el=>el!==''))
        .map(([COMMAND,PID,SessionName,Session,MEM]) => ({
            PID,
            SessionName,
            Session,
            MEM,
            COMMAND
        }));
};

async function killp(pid){
    const id = "killp";
    switch(osType){
        case 'win32':
            try{
                await run(`taskkill /f /pid ${pid}`);
                return {ok:true,id:'killp'}
            }catch(e){
                let err = (e.stderr).trim().replace('ERROR:','');
                return {id,ok:false,errors:[err.replace('\r\n','')]}
            }
        break;
        case 'linux':
            try{
                await run(`kill ${pid}`);
                return {ok:true,id:'killp'}
            }catch(e){
                let err = (e.stderr).trim().replace('ERROR:','');
                return {id,ok:false,errors:[err.replace('\n','')]}
            }
        break;
        default:
            return {ok:false,id:'killp'}
        break
    }
}

function MakeJsonArray(stdout) {
    const arr = stdout.trim().split('\n');
    let objArr = [];
    arr.forEach((line, i) => {
        if (i >= 7) {
            const obj = ExtractLine(line);
            objArr.push(obj);
        }
    });
    return objArr;
}

function ExtractLine(line) {
    const srcArray = line.split(' ');
    const row = srcArray.filter(el => '' !== el);
    const cols = ["PID", "USER", "PR", "NI", "VIRT", "RES", "SHR", "S", "CPU", "MEM", "TIME", "COMMAND"];
    let obj = {};
    for (let i = 0; i <= 11; i++) {
        obj[cols[i]] = row[i]
    }
    return obj
}

module.exports = {
    killp,
    getAllProcesses
}