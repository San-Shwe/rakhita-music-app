import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  try {
    console.log("----------<<store>>---------last-position", lastPosition);
    await AsyncStorage.setItem(
      "previousAudio",
      JSON.stringify({ audio: { ...audio, lastPosition }, index }) // store json format to text format
    );
  } catch (error) {
    console.log("error from store helper, -> ", error);
  }
};

export const storeThemeForNextOpening = async (isDarkTheme) => {
  try {
    console.log("theme stored");
    await AsyncStorage.setItem(
      "previousTheme",
      JSON.stringify({ isDarkTheme }) // store json format to text format
    );
  } catch (error) {
    console.log("error from THEME store helper, -> ", error);
  }
};

export const storePlayListForNextOpening = async (updatedList) => {
  try {
    console.log("----------<<store>>--------- playlist");
    await AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
  } catch (error) {
    console.log("error from store Playlist helper, -> ", error);
  }
};

export const storeArtworkForTheNextOpening = async (artWork) => {
  try {
    console.log("----------<<store>>--------- artwork");
    await AsyncStorage.setItem("cover", JSON.stringify([...artWork]));
  } catch (error) {
    console.log("error from store artwork helper, -> ", error);
  }
};

// convert to readable time
export const convertTime = (minutes) => {
  try {
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
  } catch (error) {
    console.log("error is ", error);
  }
};
