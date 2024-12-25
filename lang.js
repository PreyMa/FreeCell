
module('lang', () => {

  const English= {
    newGame: 'New Game',
    undo: 'Undo',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    startNewGame: 'Do you want to start a new game?',
    youWon: 'You won!'
  };

  const German= {
    newGame: 'Neues Spiel',
    undo: 'Rückgängig',
    cancel: 'Abbrechen',
    ok: 'OK',
    yes: 'Ja',
    no: 'Nein',
    startNewGame: 'Möchten Sie ein neues Spiel beginnen?',
    youWon: 'Gewonnen!'
  };

  function setLanguage( name ) {
    const languages= { german: German, english: English };
    const lang= languages[name];
    if( !lang ) {
      return;
    }

    document.querySelectorAll('[data-text]').forEach( element => {
      const text= lang[element.getAttribute('data-text')];
      if( text ) {
        element.textContent= text;
      }
    });
  }

  return {
    setLanguage
  };
});
