module('card-slice', () => {

  function cardArrayIsAlternatinglySorted( cards ) {
    
  }

  class CardSlice {
    constructor(cards= []) {
      if( !Array.isArray(cards) && !(cards instanceof NodeList) ) {
        cards= [cards];
      }
      
      this.cards= cards;
    }

    get size() {
      return this.cards.length;
    }

    get isEmpty() {
      return !this.cards.length;
    }

    get first() {
      return this.cards[0];
    }

    isAlternatinglySorted() {
      for( let i= 0; i< this.cards.length-1; i++ ) {
        const lower= this.cards[i];
        const upper= this.cards[i+1];
        if( !lower.isNextOfAlternating(upper) ) {
          return false;
        }
      }

      return true;
    }

    isRankSorted() {
      for( let i= 0; i< this.cards.length-1; i++ ) {
        const lower= this.cards[i];
        const upper= this.cards[i+1];
        if( lower.rankNumber <= upper.rankNumber ) {
          return false;
        }
      }

      return true;
    }
  }

  return {
    CardSlice
  };
});
