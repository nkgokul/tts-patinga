import React, { useState, useEffect, useRef } from "react";

function TextToSpeechBasic() {
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [numWords, setNumWords] = useState(10);
  const handleNumWordsChange = (e) => {
    setNumWords(parseInt(e.target.value));
  };

  const [settings, setSettings] = useState({
    includeThreeLetter: true,
    includeFourLetter: true,
    includeFiveLetter: true
  });

  const textRef = useRef();

  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const utteranceRef = useRef(null);
  const pause = () => {
    if (utteranceRef.current && speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  };
  const resume = () => {
    if (utteranceRef.current && speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const handleReadPauseClick = () => {
    speakText(text);
    // For handling pause and resume
    // if (!isReading) {
    //   setIsReading(true);
    //   setIsPaused(false);
    //   speakText(text);
    // } else {
    //   if (isPaused) {
    //     setIsPaused(false);
    //     resume();
    //   } else {
    //     setIsPaused(true);
    //     pause();
    //   }
    // }
  };

  const threeLetterWordsAll = [
    "cat", "dog", "bat", "ant", "bee", "car", "run", "sun", "hat", "map",
    "pen", "box", "key", "log", "cup", "win", "ear", "sea", "row", "sky",
    "pig", "rat", "oil", "mix", "wet", "cry", "tie", "egg", "dip", "ash",
    "lip", "leg", "jaw", "owl", "fox", "yak", "gum", "rib", "lid", "pop",
    "urn", "oak", "mud", "yen", "jay", "paw", "ram", "dew", "pin", "bug"
  ];

  const threeLetterWords = [
    "bag", "bed", "big", "bog", "bug", "bun", "but", "cab", "can", "cap",
    "cat", "cob", "cod", "cog", "cop", "cub", "cut", "dab", "den", "dig",
    "dim", "dip", "dog", "dot", "dug", "dun", "fat", "fig", "fin", "fit",
    "fix", "fog", "fun", "fur", "gab", "gas", "gem", "get", "gig", "gin",
    "got", "gum", "gut", "jab", "jam", "jig", "job", "jog", "jot", "jug"
  ];    

  const fourLetterWords = [
    "tree", "road", "shop", "bird", "jump", "rain", "lion", "fish", "wind", "lock",
    "ship", "book", "wave", "film", "fire", "star", "milk", "king", "rock", "talk",
    "hand", "foot", "love", "lake", "snow", "time", "face", "ring", "clay", "sand",
    "moon", "hair", "cave", "doll", "coat", "cold", "warm", "bake", "cake", "fork",
    "corn", "hike", "jazz", "knee", "lawn", "maze", "nectar", "pulp", "quip", "rope"
  ];

  const fiveLetterWords = [
    "apple", "table", "chair", "world", "happy", "river", "green", "stone", "watch", "paper",
    "bread", "glass", "heart", "music", "piano", "guitar", "dance", "photo", "snake", "laugh",
    "beach", "sugar", "candy", "water", "grape", "train", "shirt", "shoes", "floor", "wheel",
    "voice", "mouse", "light", "earth", "phone", "storm", "sweat", "honey", "sword", "brick",
    "field", "plant", "fence", "brush", "match", "flame", "berry", "scent", "index", "wool"
  ];

  const generateRandomWords = (numWords) => {
    const words = [];

    for (let i = 0; i < numWords; i++) {
      let wordLength;
      do {
        wordLength = Math.floor(Math.random() * 3) + 3;
      } while (
        (wordLength === 3 && !settings.includeThreeLetter) ||
        (wordLength === 4 && !settings.includeFourLetter) ||
        (wordLength === 5 && !settings.includeFiveLetter)
      );

      const wordsArray =
        wordLength === 3
          ? threeLetterWords
          : wordLength === 4
          ? fourLetterWords
          : fiveLetterWords;

      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      words.push(wordsArray[randomIndex]);
    }

    return words.join(" ");
  };

  const handleSettingChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked
    });
  };

  const [text, setText] = useState(generateRandomWords());

  const refillWords = () => {
    setText(generateRandomWords(numWords));
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const speakText = async () => {
    const words = text.split(/\s+/);
    const utterance = new SpeechSynthesisUtterance();
    let currentIndex = 0;

    utterance.onend = () => {
      setHighlightIndex(-1);
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        setHighlightIndex(currentIndex);
        currentIndex++;
      }
    };

    for (const word of words) {
      utterance.text = word;
      speechSynthesis.speak(utterance);
      await new Promise((resolve) => {
        utterance.onend = resolve;
      });
    }
  };

  const highlightedText = text.split(" ").map((word, index) => (
    <span
      key={index}
      className={`px-1 ${highlightIndex === index ? "bg-yellow-300" : ""}`}
    >
      {word} &nbsp;
    </span>
  ));

  useEffect(() => {
    refillWords();
  }, [settings, numWords]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-5">Text-to-Speech Highlighter</h1>
      <div className="w-full max-w-md">
        {/* Settings checkboxes */}
        <div className="mb-3">
          <label className="mr-4">
            <input
              type="checkbox"
              name="includeThreeLetter"
              checked={settings.includeThreeLetter}
              onChange={handleSettingChange}
              className="mr-1"
            />
            3-letter words
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              name="includeFourLetter"
              checked={settings.includeFourLetter}
              onChange={handleSettingChange}
              className="mr-1"
            />
            4-letter words
          </label>
          <label>
            <input
              type="checkbox"
              name="includeFiveLetter"
              checked={settings.includeFiveLetter}
              onChange={handleSettingChange}
              className="mr-1"
            />
            5-letter words
          </label>
        </div>
        {/* Number of words input */}
        <div className="mb-3">
          <label className="mr-4">
            Number of words:
            <input
              type="number"
              value={numWords}
              onChange={handleNumWordsChange}
              className="ml-2 py-1 px-2 rounded border border-gray-400"
            />
          </label>
        </div>
     </div>
      <div className="w-full max-w-md">
        <textarea
          ref={textRef}
          value={text}
          onChange={handleTextChange}
          className="w-full p-2 mb-3 bg-white border border-gray-300 rounded-md"
          rows={4}
        />
          <button
            onClick={handleReadPauseClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
          >
            {/* {isReading && !isPaused ? "Pause" : "Read Text"} */}
            Read Text
          </button>
          <button
            onClick={refillWords}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Refill Words
          </button>
        <div className="mt-5 p-5 bg-white border border-gray-300 rounded-md">
          {highlightedText}
        </div>
      </div>
    </div>
  );
}

export default TextToSpeechBasic;
