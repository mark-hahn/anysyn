'use babel';

// AnySyn package (https://github.com/mark-hahn/anysyn)

import * as SubAtom from 'sub-atom';

let log = console.log.bind(console);

export let config = {
  regexes: {
    title: 'Regexes to match file paths to syntax plugins',
    description: 'Format is regex:plugin-name, separate with commas',
    type: 'array',
    default: ['.*/anysyn1.js:coffee', '.*/anysyn2.js:coffee'],
    items: { type: 'string' }
  }
}

export let activate = () => {
  this.subs = new SubAtom;
  
  log('AnySyn activated');
  this.syntaxServices = [];
  atom.config.observe('anysyn.regexes', () => this.parseRegexes());
  this.opener = (filePath, options) => {
    log('opener', {filePath, options});
    for (regexMatch of this.regexMatches) {
      if (regexMatch.regex.test(filePath)) {
        for (service of this.syntaxServices) {
          if (service.name === regexMatch.plugin) {
            found = true;
            this.loadFile(filePath, service);
            return new atom.TextEditor;
          }
        }
        log(`AnySyn, Plugin not found: ${regexMatch.plugin}`);
      }
    }
  }
  atom.workspace.addOpener(this.opener);
  this.subs.add(this.opener);
}

export let addSyntax = (syntaxService) => {
  log('addSyntax', syntaxService.name);
  syntaxServices.push(syntaxService);
}

export let deActivate = () =>  {
  this.subs.dispose();
  log('AnySyn deActivated');
}

// ------------ Private ------------

this.parseRegexes = () => {
  this.regexMatches = [];
  for (regex of atom.config.get('anysyn.regexes')) {
    let [regexStr, plugin] = regex.split(':');
    if (typeof regexStr !== 'string' || typeof plugin !== 'string')
      log(`AnySyn: Configuration parse error for ${regexStr}:${plugin}`);
    this.regexMatches.push({regex: new RegExp(regexStr), plugin});
  }
  log('this.regexMatches', this.regexMatches);
}

this.loadFile = (filePath, service) => {
  log('loadFile', {filePath, service});
}

