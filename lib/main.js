'use babel';

// AnySyn package (https://github.com/mark-hahn/anysyn)

import SubAtom from 'sub-atom';

const log = console.log.bind(console);

class AnySyn {
  
  get config () {
    return {
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
  }

  activate () {
    this.subs = new SubAtom;
    this.syntaxServices = [];
    this.subs.add(atom.config.observe('anysyn.regexes', () => this.parseRegexes()));
    this.subs.add(atom.workspace.observeTextEditors((editor) => this.checkEditor(editor)));
  }

  addSyntax (syntaxService) {
    log('addSyntax', syntaxService.name);
    this.syntaxServices.push(syntaxService);
  }

  deActivate () {
    this.subs.disposeAll();
    log('AnySyn deActivated');
  }

  // ------------ Private --------------

  parseRegexes () {
    this.regexMatches = [];
    for (regex of atom.config.get('anysyn.regexes')) {
      const [regexStr, plugin] = regex.split(':');
      if (typeof regexStr !== 'string' || typeof plugin !== 'string')
        log(`AnySyn: Configuration parse error for ${regexStr}:${plugin}`);
        continue;
      this.regexMatches.push({regex: new RegExp(regexStr), plugin});
    }
    log('this.regexMatches', this.regexMatches);
  }

  checkEditor (editor) {  
    log('checkEditor', {editor});
    let filePath = editor.getPath();
    for (regexMatch of this.regexMatches) {
      if (regexMatch.regex.test(filePath)) {
        for (service of this.syntaxServices) {
          if (service.name === regexMatch.plugin) {
            this.loadFile(editor, filePath, service);
            return
          }
        }
        log(`AnySyn, Plugin not found: ${regexMatch.plugin}`);
      }
    }
  }

  loadFile (editor, filePath, service) {
    log('loadFile', {editor, filePath, service});
  }
}

export default new AnySyn;
