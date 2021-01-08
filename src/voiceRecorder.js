import React from 'react';
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css'
const initialAudioState = {
    audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      }
}
class VoiceRecorder extends React.Component {
    state = {
       ...initialAudioState
    }
    handleAudioStop = (data) => {
        console.log(data)
        this.setState({ audioDetails: data });
    }
    handleRest = () => {
        this.setState(initialAudioState);
    }
    handleAudioUpload = (file) => {
        this.props.upload(file)
        this.handleRest()
    }
    render() {
        return <Recorder
        record={true}
        title={"Record your voice to send a message"}
        audioURL={this.state.audioDetails.url}
        showUIAudio
        handleAudioStop={data => this.handleAudioStop(data)}
        handleAudioUpload={data => this.handleAudioUpload(data)}
        handleRest={() => this.handleRest()} 
    />
    }
}

export default VoiceRecorder