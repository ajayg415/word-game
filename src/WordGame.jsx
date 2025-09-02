import React, { useState, useEffect } from 'react';
import words from './words';

function _getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

const WordGame = () => {
  const [word, setWord] = useState('');
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const MAX_WORDS = 10;
  const [usedWords, setUsedWords] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const spellAndPronounce = (w) => {
    if ('speechSynthesis' in window && w) {
      const spellUtter = new window.SpeechSynthesisUtterance(w.split('').join(' '));
      spellUtter.rate = 0.8;
      window.speechSynthesis.speak(spellUtter);
      spellUtter.onend = () => {
        const wordUtter = new window.SpeechSynthesisUtterance(w);
        wordUtter.rate = 0.9;
        window.speechSynthesis.speak(wordUtter);
      };
    }
  };

  const showWord = () => {
    if (usedWords.length === MAX_WORDS) {
      setGameOver(true);
      setVisible(false);
      setWord('');
      return;
    }
    let newWord;
    const remainingWords = words.filter(w => !usedWords.includes(w));
    newWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setWord(newWord);
    setVisible(true);
    setTimer(5);
    setUsedWords(prev => [...prev, newWord]);
    // Spell the word aloud after displaying
    setTimeout(() => spellAndPronounce(newWord), 500);
  };

  useEffect(() => {
    showWord();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && !gameOver) {
        showWord();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, usedWords]);

  useEffect(() => {
    let interval;
    if (visible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0 && visible) {
      setVisible(false);
    }
    return () => clearInterval(interval);
  }, [visible, timer]);

  const handleReset = () => {
    setUsedWords([]);
    setGameOver(false);
    setWord('');
    setVisible(false);
    setTimer(0);
    setTimeout(() => showWord(), 300);
  };

  const handleRepeat = () => {
    if (word) {
      setVisible(true);
      setTimer(5);
      spellAndPronounce(word);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {gameOver ? (
        <div style={{ fontSize: '3rem', color: 'green', margin: '40px' }}>
          End Game!<br />All {MAX_WORDS} words are done.
        </div>
      ) : visible ? (
        <>
          <div style={{ fontSize: '2rem', color: '#555', marginBottom: '10px' }}>
            Word {usedWords.length} of {MAX_WORDS}
          </div>
          <div style={{ fontSize: '5rem', margin: '20px', letterSpacing: '0.2em', fontWeight: 'bold' }}>
            {word.toUpperCase()}
          </div>
          <div style={{ fontSize: '2rem', color: '#888', marginBottom: '20px' }}>
            Timer: {timer}
          </div>
        </>
      ) : (
        <div style={{ fontSize: '2rem', margin: '20px' }}>Word is hidden!</div>
      )}
      <div style={{ marginTop: '30px' }}>
        {!gameOver && (
          <>
            <button onClick={showWord} style={{ fontSize: '1.2rem', padding: '10px 20px', marginRight: '10px' }}>
              Show New Word
            </button>
            <button onClick={handleRepeat} style={{ fontSize: '1.2rem', padding: '10px 20px', marginRight: '10px' }} disabled={!word}>
              Repeat Word
            </button>
          </>
        )}
        <button onClick={handleReset} style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default WordGame;
