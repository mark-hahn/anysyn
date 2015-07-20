'use babel';

// AnySyn package (https://github.com/mark-hahn/anysyn)

let log = console.log;
let syntaxServices = [];

export let activate = () =>  {
  console.log('AnySyn activated')
}

export let addSyntax = (syntaxService) => {
  log('addSyntax', syntaxService.getName());
  syntaxServices.push(syntaxService);
}

export let deActivate = () =>  {
  log('AnySyn deActivated')
}

