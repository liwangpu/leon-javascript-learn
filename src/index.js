require.config({ paths: { vs: './assets/vs' } });

require(['vs/libs/jquery', 'vs/libs/lodash', 'vs/editor/editor.main'], function ($, _) {
    var editorContainer = $('#editor-container')[0];
    var editor = monaco.editor.create(editorContainer, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript'
    });

    let mirrorScope = {
        $mirror: {
            grid1: {
                selectedRow: {
                    id: 'aaa',
                    name: 'Leon',
                    age: 18
                }
            }
        }
    };

    editor.onDidChangeModelDecorations(() => {
        const model = editor.getModel();
        if (model === null || model.getModeId() !== "javascript")
            return;

        const owner = model.getModeId();
        const markers = monaco.editor.getModelMarkers({ owner });

        // console.log(1, markers);
        // do something with the markers
    });

    monaco.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: ["."],
        autoIndent: true,
        provideCompletionItems: function (model, position) {
            const content = model.getLineContent(position.lineNumber);
            if (content[content.length - 1] !== '.') {
                return;
            }

            let topVariable = content.slice(0, content.indexOf('.'));
            if (topVariable !== '$mirror') { return ; }

            var variable = content.slice(0, content.length - 1);
            var value = _.get(mirrorScope, variable);
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            let suggestions = Object.keys(value).map(k => ({ label: k, kind: 3, insertText: k, range }));
            // let suggestions = [
            //     // {
            //     //     label: 'get', kind: 1, insertText: 'get()', range,
            //     //     detail: 'Angular HttpClient',
            //     // },
            //     // {
            //     //     label: 'post', kind: 1, insertText: 'post()', range,
            //     //     detail: 'Angular HttpClient',
            //     // }
            // ];
            return { suggestions };
        }
    });
});