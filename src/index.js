require.config({ paths: { vs: './assets/vs' } });

require(['vs/libs/jquery', 'vs/editor/editor.main'], function ($) {
    var editorContainer = $('#editor-container')[0];
    var editor = monaco.editor.create(editorContainer, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript'
    });

    monaco.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: ["."],
        autoIndent: true,
        provideCompletionItems: function (model, position) {
            // console.log(model, position);
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            // console.log(word);
            // console.log(range);
        }
    });
    // console.log(1, monaco);
});