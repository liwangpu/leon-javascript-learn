window.onload = function () {
    var btn1 = document.getElementById('btn1');
    var btn2 = document.getElementById('btn2');
    btn1.addEventListener('click', fun1);
    btn2.addEventListener('click', fun2);
}

function fun1() {
    task();
    console.log('complete!');
}

function fun2() {
    console.log('test 2 work!');
}

var i = 0;

function task() {
    var tip = document.getElementById('tip');
    do {
        i++;
        tip.innerHTML = i;
    } while (i < 1e3)
}