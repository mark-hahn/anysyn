'use babel';

// AnySyn package (https://github.com/mark-hahn/anysyn)

import SubAtom from 'sub-atom';

const log = console.log.bind(console);
const self = {};

export const config = {
  regexes: {
    title:       'Regexes to match file paths to syntax plugins',
    description: 'Format is regex:plugin-name, separate with commas',
    type:        'array',
    default:    ['.*/anysyn1.js:coffee', '.*/anysyn2.js:coffee'],
    items: { 
      type: 'string' 
    }
  }
}

export const activate = () => {
  self.subs = new SubAtom;
  self.syntaxServices = [];
  self.subs.add(atom.config.observe('anysyn.regexes', () => self.parseRegexes()));
  self.subs.add(atom.workspace.observeTextEditors((editor) => self.checkEditor(editor)));
}

export const addSyntax = (syntaxService) => {
  log('addSyntax', syntaxService.name);
  self.syntaxServices.push(syntaxService);
}

export const deActivate = () =>  {
  // self.subs.disposeAll();
  // log('AnySyn deActivated');
}

// ------------ Private --------------

self.parseRegexes = () => {
  self.regexMatches = [];
  for (regex of atom.config.get('anysyn.regexes')) {
    const [regexStr, plugin] = regex.split(':');
    if (typeof regexStr !== 'string' || typeof plugin !== 'string')
      log(`AnySyn: Configuration parse error for ${regexStr}:${plugin}`);
      continue;
    self.regexMatches.push({regex: new RegExp(regexStr), plugin});
  }
  log('self.regexMatches', self.regexMatches);
}

self.checkEditor = (editor) => {  
  log('checkEditor', {editor});
  let filePath = editor.getPath();
  for (regexMatch of self.regexMatches) {
    if (regexMatch.regex.test(filePath)) {
      for (service of self.syntaxServices) {
        if (service.name === regexMatch.plugin) {
          self.loadFile(editor, filePath, service);
          return
        }
      }
      log(`AnySyn, Plugin not found: ${regexMatch.plugin}`);
    }
  }
}

self.loadFile = (editor, filePath, service) => {
  log('loadFile', {editor, filePath, service});
}
