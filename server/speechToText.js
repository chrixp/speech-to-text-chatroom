const speech = require('@google-cloud/speech')
const fs = require('fs')
const { unlink, writeFile, readFile} = fs.promises
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')
const promisifiedExec = promisify(exec)
const client = new speech.SpeechClient()

const speechToText = async (opusBuffer) => {
    try {
        const wavBuffer = await convertOpusToWav(opusBuffer)
        if(!wavBuffer) {
            return null
        }
        const request = {
            audio: {
                content: wavBuffer
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 44100,
                languageCode: 'en-US'
            }
        };
        const response = await client.recognize(request)
        const results = response && response[0].results[0]
        if(results) {
            return results.alternatives[0].transcript
        } else {
            return null
        }

    } catch(err) {
        console.log(err)
        return null
    }
}

const convertOpusToWav = async (audioBuffer) => {
    const timeStamp = new Date().toISOString()
    const audioPath = path.resolve(__dirname,'audio')
    const opusFile = path.resolve(audioPath,`${timeStamp}.opus`)
    const wavFile = path.resolve(audioPath,`${timeStamp}.wav`)
    try {
        await writeFile(opusFile,audioBuffer)
        await promisifiedExec(`opusdec ${opusFile} ${wavFile}`)
        const content = await readFile(wavFile)
        await cleanUpAudioFiles(opusFile,wavFile)
        return content.toString('base64')
    } catch(err) {
        await cleanUpAudioFiles(opusFile,wavFile)
        console.log(err)
        return null
    }
}

const cleanUpAudioFiles = async (opusFile, wavFile) => {
    if(fs.existsSync(opusFile)) {
        await unlink(opusFile)
    } 
    if(fs.existsSync(wavFile)) {
        await unlink(wavFile)
    }
}
module.exports = {
    speechToText,
    convertOpusToWav
}