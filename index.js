const core = require('@actions/core')
const exec = require('@actions/exec')
const sg = require('surge')
const io = require('@actions/io')
const options ={};

async function build(commands,path){
    const command = commands.split('\n')
    command.forEach(com => {
        core.info(`Running: ${com}`)
        exec.exec(com);
    });
    core.info("Injecting 200.html")
    io.mv(path+'index.html',path+'200.html')
    core.info('Build done')
}
async function run(){
    try{
        const domain = core.getInput('domain')
        const path = core.getInput('path')
        
        let output = ''
        let errors = ''

        options.listeners = {
            stdout:(data)=>{
                output+=data.toString()
            },
            stderr:(data)=>{
                errors+=data.toString()
            }
        }
        const commands = core.getInput(build)
        build(commands,path)

        sg({ default: "publish" })([path, domain]);
        core.info('Deployment done!')
        core.setOutput('domain',output)
    }
    catch(err){
        core.setFailed(err.message)
    }
}

run()

