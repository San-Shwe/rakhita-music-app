import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index) => {
  try {
    // console.log("yes I store <audio>", audio, "<index>", index);
    await AsyncStorage.setItem(
      "previousAudio",
      JSON.stringify({ audio, index }) // store json format to text format
    );
  } catch (error) {
    console.log("error from store helper, -> ", error);
  }
};

// export const storeThemeForNextOpening = () => {}

// convert to readable time
export const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (sec == 60) {
      return `${minute + 1}:00`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};
