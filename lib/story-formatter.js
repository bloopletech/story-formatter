'use babel';

import { CompositeDisposable } from 'atom';
import { Utils } from 'deba';

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
    text = text.replace(/\r\n/g, "\n");

    //Replace runs of spaces with a single space; also converts all types of space to ASCII space
    text = text.replace(/[ \f\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/gm, " ");

    //Remove leading spaces
    text = text.replace(/^ +/gm, "");

    //Remove trailing spaces
    text = text.replace(/ +$/gm, "");

    //Remove non-empty blank lines
    text = text.replace(/^ +$/gm, "");

    //Remove leading newlines at start of text
    text = text.replace(/^\n+/, "");

    //Remove excess trailing newlines at end of text
    text = text.replace(/\n{2,}$/, "\n");

    //Convert more than double line breaks into double line breaks
    text = text.replace(/\n{3,}/g, "\n\n");

    var linebreakCount = (text.match(/\n/g) || []).length;
    var internalLinebreakCount = (text.match(/.+?\n.+?/g) || []).length;
    var internalLinebreakRatio = internalLinebreakCount / linebreakCount;

    //If text appears to contain hard-wrapped paragraphs
    if(internalLinebreakRatio >= 0.25 && internalLinebreakRatio < 1) {
      //Unrwap paragraphs
      text = text.replace(/(.)\n(.)/g, "$1 $2").replace(/ {2,}/, " ");
    }
    else {
      //Convert single line breaks into double line breaks
      text = text.replace(/(.)\n(.)/g, "$1\n\n$2");
    }

    //Escape any characters that have special meaning in Markdown (Commonmark specifically)
    text = Utils.escape(text);

    editor.setText(text);
  }
};
