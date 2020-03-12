window.onload = function () {
    var btnTestNode = document.getElementById('btnTest');
    btnTestNode.addEventListener('click', funTest);
}

function funTest() {
    console.log('test work!');
}