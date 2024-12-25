module('game', () => {

  const { shuffleArray } = require('util');
  const { makeElement }= require('elements');
  const { Cards } = require('cards');
  const { HomeStack, FreeStack, TableauStack } = require('card-stack');
  const { CardSlice } = require('card-slice');


  class Game {
    constructor() {
      const size= 120;
      
      this.element= makeElement('main', [
        this.topRow= makeElement('div.row'),
        this.bottomRow= makeElement('div.row')
      ]);
      this.element.componentInstance= this;
      this.element.style.setProperty('--card-size', `${size}`);

      this.freeStacks= this._insertCardStacks(this.topRow, FreeStack, 4);
      this.homeStacks= this._insertCardStacks(this.topRow, HomeStack, 4);
      this.tableauStacks= this._insertCardStacks(this.bottomRow, TableauStack, 8);

      this.cards= Object.keys(Cards).map( card => Cards[card] );

      this.onGameDone= null;
      this.moveHistory= [];
      this.acceptsInputs= true;

      this.reset();
    }

    reset() {
      this.moveHistory= [];
      this.acceptsInputs= true;

      this._shuffleCards();
      this._dealCards();
    }

    isDone() {
      for( const stack of this.freeStacks ) {
        if( !stack.isEmpty ) {
          return false;
        }
      }

      for( const stack of this.tableauStacks ) {
        if( !stack.isEmpty ) {
          return false;
        }
      }

      return true;
    }

    _insertCardStacks( parentElement, Type, count ) {
      const stacks= [];
      for( let i= 0; i< count; i++ ) {
        const cardStack= new Type( i );
        stacks.push( cardStack );
        parentElement.appendChild(cardStack.element);
      }

      return stacks;
    }

    computeMovableCardCount() {
      let count= 1;
      for( const stack of this.freeStacks ) {
        count += (stack.isEmpty ? 1 : 0);
      }

      for( const stack of this.tableauStacks ) {
        count *= (stack.isEmpty ? 2 : 1);
      }

      return count;
    }

    tryMoveCardToHomeStack( card ) {
      const slice= new CardSlice( card );
      for( const stack of this.homeStacks ) {
        if( stack.acceptsCardSlice( slice ) ) {
          this.onBeforePerformMove( slice, stack );
          stack.putCard( card );

          this.onAfterPerformMove();
          return;
        }
      }
    }

    onBeforePerformMove(cardSlice, newStack) {
      if( cardSlice.isEmpty ) {
        return;
      }

      const oldStack= cardSlice.first.parentStack;
      this.moveHistory.push({cardSlice, oldStack, newStack});
      
    }
    
    onAfterPerformMove() {
      if( !this._tryDoDoneCallback() ) {
        this._tryToSolveRemaining();
      }
    }

    undoLastMove() {
      if( !this.acceptsInputs ) {
        return;
      }
      
      const lastMove= this.moveHistory.pop();
      if( !lastMove ) {
        return;
      }

      const {cardSlice, oldStack, newStack}= lastMove;
      for( const card of cardSlice.cards ) {
        oldStack.putCard( card );
      }
    }

    _shuffleCards() {
      shuffleArray( this.cards );
    }

    _dealCards() {
      for( const stack of this.homeStacks ) {
        stack.clear();
      }

      for( const stack of this.freeStacks ) {
        stack.clear();
      }

      for( const stack of this.tableauStacks ) {
        stack.clear();
      }

      for(let i= 0; i< this.cards.length; i++) {
        const card= this.cards[i];
        const cardStack= this.tableauStacks[ i % this.tableauStacks.length ];
        cardStack.putCard( card );
      }

      // const suits= ['Spade', 'Heart', 'Diamond', 'Club'];
      // const ranks= ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'].reverse();
      // for(const rank of ranks ) {
      //   this.tableauStacks[0].putCard( Cards['Spade'+rank]);
      //   this.tableauStacks[1].putCard( Cards['Heart'+rank]);
      //   this.tableauStacks[2].putCard( Cards['Diamond'+rank]);
      //   this.tableauStacks[3].putCard( Cards['Club'+rank]);
      // }
    }

    _tryPutCardOnAnyHomeStack( card ) {
      const slice= new CardSlice( card );
      for( const stack of this.homeStacks ) {
        if( stack.acceptsCardSlice( slice ) ) {
          stack.putCard( card );
          return true;
        }
      }

      return false;
    }

    async _tryToSolveRemaining() {
      // Check if all tableau stacks are sorted
      if( this.tableauStacks.some(stack => !stack.isRankSorted() ) ) {
        return;
      }

      this.acceptsInputs= false;

      try {
        let didMoveCard= false;
        nextCard: do {
          if( didMoveCard ) {
            await new Promise( res => setTimeout(res, 150) );
          }
          
          didMoveCard= false;
  
          for( const stack of this.freeStacks ) {
            if( !stack.isEmpty && this._tryPutCardOnAnyHomeStack( stack.topCard ) ) {
              didMoveCard= true;
              continue nextCard;
            }
          }
  
          for( const stack of this.tableauStacks ) {
            if( !stack.isEmpty && this._tryPutCardOnAnyHomeStack( stack.topCard ) ) {
              didMoveCard= true;
              continue nextCard;
            }
          }

        } while( didMoveCard );

      } finally {
        this.acceptsInputs= true;
        this.moveHistory= [];     // Nuke the history as we moved a bunch of cards without creating any entries
      }

      this._tryDoDoneCallback();
    }

    _tryDoDoneCallback() {
      if( this.isDone() && this.onGameDone ) {
        this.onGameDone();
        return true;
      }

      return false;
    }
  }



  return {
    Game
  };
});
