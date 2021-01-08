const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const { v4 } = require('uuid')
const axios = require('axios')
const Transcribe = new AWS.TranscribeService({
    apiVersion: '2017-10-26',
    region: 'us-east-1'
})

const bucketName = 'senior-design-speech-to-text'

const putAudioFileInS3 = async (file) => {
    const fileName = `audio-${new Date().toISOString()}.wav`
    const params = {
        Body: file,
        Bucket: bucketName,
        Key: fileName
    }
    try {
        const res = await S3.putObject(params).promise()
        if(res) {
            return fileName
        } else {
            throw Error("Unexpected error")
        }
    } catch(err) {
        console.log(err)
        return null;
    }
}


const transcribeFile = async (file, returnTranscript) => {
    const params = {
        Media: {
            MediaFileUri: `s3://${bucketName}/${file}`
        },
        TranscriptionJobName: `TranscriptionJob-${v4()}`,
        ContentRedaction: {
            RedactionType: "PII",
            RedactionOutput:  "redacted_and_unredacted"
        },
        LanguageCode: "en-US",
    }
    try {
        const job = await Transcribe.startTranscriptionJob(params).promise()
            .then(res => res.TranscriptionJob.TranscriptionJobName)

        
        checkTranscriptionResult(job, (link) => {
            if(!link) {
                console.log("NO LINK PROVIDED")
            } else {
                axios.get(link)
                    .then(res => res.data.results.transcripts[0].transcript)
                    .then(transcript => returnTranscript(transcript))
            }
        })
        
                
    } catch(err) {
        console.log(err)
        returnTranscript(null)
    }

}

const checkTranscriptionResult = async (jobName,returnLink) => {
    let times = 12
    const intervals = setInterval(async () => {
        times += 1
        if(times === 8) {
            returnLink(null)
            clearInterval(intervals)
        }
        const transcriptionResult = await getTranscriptionResult(jobName)
            .then(result => result.TranscriptionJob)
        if(transcriptionResult.TranscriptionJobStatus === 'COMPLETED') {
            const redactedContentLink = transcriptionResult.Transcript.TranscriptFileUri
            console.log("COMPLETED")
            returnLink(redactedContentLink)
            clearInterval(intervals)
        } else {
            console.log(transcriptionResult)
            console.log("JOb NOT DONE")
        }
    }, 5000)
}

const getTranscriptionResult = (job) => {
    return Transcribe.getTranscriptionJob({ TranscriptionJobName: job }).promise()
}   

module.exports = { putAudioFileInS3, transcribeFile }


