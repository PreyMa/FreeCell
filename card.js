module( 'cards', () => {
  const { makeElement }= require('elements');


  class Card {
    constructor(suit, rank, x, y) {
      this.suit= suit;
      this.rank= rank;
      this.name= suit+ rank;
  
      this.element= makeElement('div.card', {draggable: true}, [
        makeElement('div')
      ]);

      this.element.componentInstance= this;
      this.element.id= `card-${this.name}`;
      this.element.style.setProperty('--sprite-x', `${-x}`);
      this.element.style.setProperty('--sprite-y', `${-y}`);

      this.element.ondragstart= e => {
        this._onDragStart(e);
      };

      this.element.ondblclick= () => {
        if( window.game.acceptsInputs ) {
          window.game.tryMoveCardToHomeStack( this );
        }
      };
    }

    _onDragStart( e ) {
      if( !window.game.acceptsInputs ) {
        return;
      }

      const cardSlice= this.parentStack.cardSliceStartingFrom( this );

      // Only stacks of alternating colored cards can be moved at a time
      if( !cardSlice.isAlternatinglySorted() ) {
        return;
      }

      e.dataTransfer.clearData();
      e.dataTransfer.setData('freecell-card', this.element.id);
      e.dataTransfer.setData('freecell-stack', this.parentStack.element.id);
    }

    set topOffset( offset ) {
      this.element.style.setProperty('--top-offset', `${offset}px`)
    }

    get parentStack() {
      return this.element.parentElement.componentInstance;
    }

    get color() {
      return (this.suit === 'Heart' || this.suit === 'Diamond') ? 'red' : 'black';
    }

    get isAce() {
      return this.rank === 'Ace';
    }

    get rankNumber() {
      switch( this.rank ) {
        case 'Ace': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case '10': return 10;
        case 'Jack': return 11;
        case 'Queen': return 12;
        case 'King': return 13;
        default: -1;
      }
    }

    isNextOfSuit( other ) {
      return this.suit === other.suit && this.rankNumber - 1 === other.rankNumber;
    }

    isNextOfAlternating( other ) {
      return this.color !== other.color && this.rankNumber - 1 === other.rankNumber;
    }
  }
  
  const Cards= {};
  
  function loadCards() {
    const suits= ['Spade', 'Heart', 'Diamond', 'Club'];
    const ranks= ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  
    const width= 181;
    const height= 271;
    const spacing= 14.8;
  
    for(let row= 0; row< suits.length; row++) {
      for(let column= 0; column< ranks.length; column++) {
        const suit= suits[row];
        const rank= ranks[column];
  
        const x= (column+1)* spacing+ column* width;
        const y= (row+1)* spacing+ row* height;
        
        const card= new Card( suit, rank, x, y, width, height );
        Cards[card.name]= card;
      }
    }
  }
  
  loadCards();

  return {
    Card,
    Cards
  }
});
