module('elements', () => {

  function makeElement( name, attributes= null, children= null ) {
    if( !children && Array.isArray(attributes) ) {
      children= attributes;
      attributes= null;
    }

    attributes ||= {};
    children ||= [];

    const parts= name.split('.').map( n => n.trim() );

    const element= document.createElement( parts[0] );

    for(let i= 1; i< parts.length; i++) {
      element.classList.add( parts[i] );
    }

    for( const key in attributes ) {
      element.setAttribute(key, attributes[key]);
    }

    for( const child of children ) {
      element.appendChild(child);
    }

    return element;
  }

  return {
    makeElement
  };
});
