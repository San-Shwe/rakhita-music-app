import { storeAudioForNextOpening } from "./storeHelper";

// play audio
export const play = async (playbackObj, uri) => {
  try {
    console.log("start");
    return await playbackObj.loadAsync(
      {
        uri,
      },
      { shouldPlay: true }
    );
  } catch (error) {
    console.log("error indie paly helper method", error);
  }
};

// pause audio
export const pause = async (playbackObj) => {
  try {
    console.log("pause");
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error indie pause helper method", error);
  }
};

// resume audio
export const resume = async (playbackObj) => {
  try {
    console.log("resume");
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error indie resume helper method", error);
  }
};

// paly another audio
export const playNext = async (playbackObj, uri) => {
  try {
    console.log("playNext");
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error indie playNext helper method", error);
  }
};

export const selectAudio = async (audio, context) => {
  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateState,
    onPlaybackStatusUpdate,
    audioFile,
  } = context; // states from AudioProvider

  try {
    // playing audio for the first time > just once
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri);
      // get current audio index
      const index = audioFile.indexOf(audio);
      // set current music status to state and Exit function
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // update current duration and positions regularly
      return storeAudioForNextOpening(audio, index); // store current audio and its' index
    }

    // pause audio > if playing
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id == audio.id
    ) {
      const status = await pause(playbackObj);
      // get current audio index
      const index = audioFile.indexOf(audio);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        currentAudioIndex: index,
      });
    }

    // resume audio > if click recent song
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id == audio.id
    ) {
      const status = await resume(playbackObj);
      // get current audio index
      const index = audioFile.indexOf(audio);
      return updateState(context, {
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      // get current audio index
      console.log(
        "play another song ------------------------------------------------ "
      );
      console.log(audio.id);
      const index = audioFile.indexOf(audio);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index); // store current audio and its' index
    }
  } catch (error) {
    console.log("error inside select audio method", error);
  }
};

// previous and next section ------------start------------------------------------------------------
export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFile,
    updateState,
  } = context;

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 == totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;

    console.log(currentAudioIndex + 1, " : ", totalAudioCount);

    console.log("isfirstaudio : ", isFirstAudio);
    console.log("isLastAudio : ", isFirstAudio);
    console.log("isLoaded : ", isLoaded);

    let audio;
    let index;
    let status;
    if (select === "next") {
      console.log("next");
      audio = audioFile[currentAudioIndex + 1];
      // for next
      if (!isLoaded && !isLastAudio) {
        // if audio is new play the first time
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
      }

      if (isLoaded && !isLastAudio) {
        // if it is loaded but not last audio
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFile[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    if (select === "previous") {
      console.log("previous");
      audio = audioFile[currentAudioIndex - 1];
      // for previous
      if (!isLoaded && !isFirstAudio) {
        // if audio is new
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
      }

      if (isLoaded && !isFirstAudio) {
        // if it is loaded but not first audio
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFile[index];
        console.log(audio);
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log("error inside change audio method", error);
  }
};
// --------------------------------end---------------------------------------------