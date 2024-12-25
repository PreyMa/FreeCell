module('settings', () => {

  const STORAGE_KEY= 'freecell-settings';

  function loadSettings() {
    const json= window.localStorage.getItem(STORAGE_KEY);
    if( json ) {
      return JSON.parse( json );
    }

    // Default settings
    return {
      language: 'german'
    };
  }

  function saveSettings( settings ) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings) );
  }

  return {
    loadSettings,
    saveSettings
  };
});
