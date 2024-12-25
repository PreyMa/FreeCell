module('card-stack', () => {
  const { makeElement }= require('elements');
  const { CardSlice }= require('card-slice');


  class CardStack {
    constructor(type= '', index) {
      this.element= makeElement(`div.card-stack.${type}`)
      this.element.componentInstance= this;
      this.element.id= `${type}-${index}`;


      this.element.ondragover= e => {
        e.preventDefault();
      };

      this.element.ondrop= e => {
        this._onDrop( e );
      };
    }

    get isEmpty() {
      return !this.element.childElementCount;
    }

    get topCard() {
      return this.isEmpty ? null : this.element.children[this.element.childElementCount-1].componentInstance;
    }

    putCard( card ) {
      card.topOffset= 0;
      this.element.appendChild( card.element );
    }

    clear() {
      while( this.element.firstElementChild ) {
        this.element.firstElementChild.remove();
      }
    }

    cardSliceStartingFrom( card ) {
      const slice= [];
      for( const child of this.element.children ) {
        if( child.componentInstance === card || slice.length ) {
          slice.push( child.componentInstance );
        }
      }

      return new CardSlice( slice );
    }

    toCardSlice() {
      return new CardSlice( Array.from( this.element.children ).map( child => child.componentInstance ) );
    }

    _onDrop(e) {
      const cardId = e.dataTransfer.getData('freecell-card');
      const cardStackId = e.dataTransfer.getData('freecell-stack');
      if( !cardId ) {
        return;
      }

      const card = document.getElementById(cardId).componentInstance;
      const cardStack = document.getElementById(cardStackId).componentInstance;

      if( cardStack === this ) {
        return;
      }

      const cardSlice= cardStack.cardSliceStartingFrom( card );

      if( cardSlice.size > window.game.computeMovableCardCount() ) {
        return;
      }

      if( !this.acceptsCardSlice(cardSlice) ) {
        return;
      }

      window.game.onBeforePerformMove( cardSlice, this );

      for( const card of cardSlice.cards ) {
        this.putCard( card );
      }

      window.game.onAfterPerformMove();
    }
  }

  class TableauStack extends CardStack {
    constructor(num) {
      super('tableau', num);
    }

    putCard( card ) {
      const index= this.element.children.length;
      if( index > 0 ) {
        card.topOffset= index * 40;
      }

      this.element.appendChild( card.element );
    }

    acceptsCardSlice( slice ) {
      if( this.isEmpty ) {
        return true;
      }

      return !slice.isEmpty && this.topCard.isNextOfAlternating( slice.first );
    }

    isRankSorted() {
      return this.toCardSlice().isRankSorted();
    }
  }

  class FreeStack extends CardStack {
    constructor(num) {
      super('free', num);
    }

    acceptsCardSlice( slice ) {
      return this.isEmpty;
    }
  }

  class HomeStack extends CardStack {
    constructor(num) {
      super('home', num);
    }

    acceptsCardSlice( slice ) {
      if( slice.size !== 1 ) {
        return false;
      }

      if( this.isEmpty ) {
        return slice.first.isAce;
      }

      return slice.first.isNextOfSuit( this.topCard );
    }

    cardSliceStartingFrom( card ) {
      // Cards cannot be moved away from the home stack
      return new CardSlice();
    }
  }

  return {
    TableauStack,
    FreeStack,
    HomeStack
  };
});
