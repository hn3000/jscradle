
import * as cm from 'codemirror';
import * as ts from 'typescript';

export enum MimeType {
  HTML = 'text/html',
  CSS = 'text/css',
  SCRIPT = 'application/ecmascript'
}

export interface IFileData {
  name: string;
  contents: string;
  mimeType: MimeType;
}

export interface IPreviewRunner {
  createElement();

  update(files: IFileData[]);
}

declare function require(name:string): any;

require('codemirror/lib/codemirror.css');


let codeCM: cm.Editor;
let htmlCM: cm.Editor;

let contents = {
  tsText: '',
  jsText: '',
  htmlText: ''
};

export default function init() {

  const codeTA = document.getElementById('code') as HTMLTextAreaElement;
  const htmlTA = document.getElementById('html') as HTMLTextAreaElement;

  codeCM = cm.fromTextArea(codeTA, { lineNumbers: true, mode: 'typescript' });
  htmlCM = cm.fromTextArea(htmlTA, { lineNumbers: true, mode: 'html' });

  contents = JSON.parse(localStorage.getItem('contents') || '{ }');
  if (contents.tsText) codeCM.setValue(contents.tsText);
  if (contents.htmlText) htmlCM.setValue(contents.htmlText);

  codeCM.on("change", updateCode);
  htmlCM.on("change", updateHTML)

  console.log('init done');
}

/*
const host: ts.LanguageServiceHost = {
  getScriptFileNames() { return [ 'index.ts' ]; },
  getCompilationSettings() { return { }; },
  getCurrentDirectory() { return '.'; },
  getDefaultLibFileName(options) { return 'dom' },
  getScriptSnapshot(fileName: string) { },
  getScriptVersion(fileName) { return '1'; }
};
const service = ts.createLanguageService(host);
*/

const options : ts.TranspileOptions = {
  compilerOptions: {
    noImplicitAny: true
  },
  reportDiagnostics: true,
  fileName: 'index.ts'
};

function makeBlobURI(x: string, type = 'text/html') {
  let blob = new Blob([x], {type});
  return URL.createObjectURL(blob);
}

function makeDataURI(x: string, type = 'text/html') {
  let url = `data:${type};charset=utf-8;base64,${btoa(x)}`;
  return url;
}

function updateCode(cm: cm.Editor, change: cm.EditorChangeLinkedList) {
  const code = cm.getValue();
  console.log('updated code', code);
  contents.tsText = code;
  const js = ts.transpileModule(code, options);

  const jsOutput = document.getElementById('js-output') as HTMLElement;
  let outputText = js.outputText;
  contents.jsText = outputText;

  if (js.diagnostics) {
    for (const d of js.diagnostics) {
      outputText = `${d.messageText}\n` + outputText;
    }
  }
  jsOutput.innerHTML = escapeHTML(outputText);

  updateOutput();
  //console.log(outputText);
}


function updateHTML(cm: cm.Editor, change?: cm.EditorChangeLinkedList) {
  //console.log('html updated', arguments);
  contents.htmlText = cm.getValue();
  updateOutput();
}

function updateOutput() {
  const elem = document.createElement('html');
  elem.innerHTML = contents.htmlText;
  const script = document.createElement('script');
  script.innerHTML = contents.jsText;
  elem.getElementsByTagName('body')[0].appendChild(script);

  const htmlOutput = document.getElementById('html-output') as HTMLElement;
  const html = elem.outerHTML;
  htmlOutput.innerHTML = escapeHTML(html);

  const iframe = document.getElementById('result') as HTMLIFrameElement;
  iframe.srcdoc = html;

  localStorage.setItem('contents', JSON.stringify(contents));
}

function escapeHTML(html) {
  return html.replace(/>/g, '&gt;').replace(/</g, '&lt;')
}

console.log('init defined');
