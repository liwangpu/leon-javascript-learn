require.config({ paths: { vs: './assets/vs' } });

require(['vs/libs/jquery', 'vs/libs/lodash', 'vs/editor/editor.main'], function ($, _) {
    // console.log(111,_.cloneDeep({name:'df'}));
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

    monaco.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: ["."],
        autoIndent: true,
        provideCompletionItems: function (model, position) {
            const content = model.getLineContent(position.lineNumber);
            if (content[content.length - 1] !== '.') {
                return;
            }

            let topVariable = content.slice(0, content.indexOf('.'));
            if (topVariable !== '$mirror') { return { suggestions: [] }; }

            var variable = content.slice(0, content.length - 1);
            var value = _.get(mirrorScope, variable);
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            // const thisIndex = content.lastIndexOf('this');
            // const httpIndex = content.lastIndexOf('httpClient');

            // const index = Math.max(-1, thisIndex, httpIndex);
            // console.log(index, thisIndex, httpIndex)
            // console.log(content, content[content.length - 1]);
            // console.log(word);
            // console.log(range);

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