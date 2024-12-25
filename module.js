
(() => {

  class Module {
    constructor(name, initFunction, exports= null) {
      this.name= name;
      this.initFunction= initFunction;
      this.exports= exports;
      this.isImporting= false;
    }

    import() {
      try {
        this.isImporting= true;
        this.exports= this.initFunction();
      } finally {
        this.isImporting= false;
      }
    }
  }

  const modules= new Map();

  const requireStack= [];

  function printRequireStack() {
    return '\nStack: '+ requireStack.join(' -> ');
  }

  function require( name ) {
    const module= modules.get(name);
    if( !module ) {
      throw new Error(`Cannot require unknown module '${name}'`+ printRequireStack());
    }

    if( module.exports ) {
      return module.exports;
    }

    if( module.isImporting ) {
      throw new Error(`Detected circular import of module '${name}'`+ printRequireStack());
    }

    try {
      requireStack.push(name);
      module.import();

    } finally {
      requireStack.pop();
    }

    return module.exports;
  }

  function module(name, initFunction) {
    if( modules.has(name) ) {
      throw new Error(`There already is a module called '${name}'`);
    }

    const module= new Module( name, initFunction );
    modules.set(name, module);

    if( name === 'main' ) {
      require('main');
    }
  }

  window.module= module;
  window.require= require;
})();
