window.onload = function () {
    var btnTestNode = document.getElementById('btnTest');
    btnTestNode.addEventListener('click', funTest);
}

function funTest() {
    // console.log('test work!');
    System.import('tool').then(m=>{
        console.log(1,m);
        // m.hello('Leon');
    });

    // System.import('/assets/js/tool.js')
}