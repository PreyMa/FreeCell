module('main', () => {
  
  const { Game }= require('game');
  const { setLanguage }= require('lang');
  const { loadSettings, saveSettings }= require('settings');

  const game= new Game();
  window.game= game;

  document.body.appendChild( game.element );

  const settings= loadSettings();

  const newGameButton= document.getElementById('new-game-button');
  const undoButton= document.getElementById('undo-button');
  const languageButton= document.getElementById('language-button');

  const newGameModal= document.getElementById('new-game-modal');
  const gameDoneModal= document.getElementById('game-done-modal');

  undoButton.onclick= () => game.undoLastMove();

  function updateLanguageButton() {
    if( settings.language === 'english' ) {
      languageButton.textContent= 'Deutsch';
    } else {
      languageButton.textContent= 'English';
    }
  }

  languageButton.onclick= () => {
    if( languageButton.textContent.toLowerCase() === 'english' ) {
      settings.language= 'english';
    } else {
      settings.language= 'german';
    }

    updateLanguageButton();
    setLanguage(settings.language);
    saveSettings( settings );
  };

  updateLanguageButton();
  setLanguage(settings.language);

  newGameButton.onclick= () => newGameModal.showModal();
  newGameModal.onclose= () => {
    if( newGameModal.returnValue === 'confirm' ) {
      game.reset();
    }
  };

  game.onGameDone= () => gameDoneModal.showModal();
  gameDoneModal.onclose= () => game.reset();

  window.onbeforeunload= e => {
    e.preventDefault();
    // console.log('unload')
  }
});

