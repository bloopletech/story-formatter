'use babel';

import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'story-formatter:format': () => this.format()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  format() {
    var editor = atom.workspace.getActiveTextEditor();
    var text = editor.getText();

    //Convert carriage return to newline so it will get collapsed in later steps
    text = text.replace(/\r/gm, "\n");

    //Replace runs of spaces with a single space; also converts all types of space to ASCII space
    text = text.replace(/[ \f\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/gm, " ");

    //Remove leading spaces
    text = text.replace(/^ +/gm, "");

    //Remove trailing spaces
    text = text.replace(/ +$/gm, "");

    //Remove non-empty blank lines
    text = text.replace(/^ +$/gm, "");

    //Convert single line breaks into double line breaks
    text = text.replace(/\n(?!\n)/g, "\n\n");

    //Convert more than double line breaks into double line breaks
    text = text.replace(/\n{3,}/g, "\n\n");

    //Remove leading newlines at start of text
    text = text.replace(/^\n+/, "");

    //Remove excess trailing newlines at end of text
    text = text.replace(/\n{2,}$/, "\n");

    editor.setText(text);
  }
};
