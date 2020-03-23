// 所有的引用类型(函数,数组,对象)都拥有__proto__属性(隐式原型)
// 所有的函数拥有prototype属性(显式原型,仅限函数)
// 原型对象:拥有prototype属性的对象,在定义函数时就被创建
// 当调用某种方法或属性,首先会在自身调用或者查找,如果自身没有,则会去它的__proto__属性中查找,如果没有,会通过__proto__层层向上查找,直到最终到null结束
// 原型是js继承的基础,js的继承就是基于原型的继承


function Person(name, age) {
    this.name = name;
    this.age = age;
}

let p1 = new Person('Leon', 18);

let prototypeOfObject = Object.prototype;
let prototypeOfFunction = Function.prototype;

prototypeOfObject.myTest = 15;
prototypeOfFunction.myTest = 16;
Person.prototype.myTest = 17;
Person.myTest = 18;

console.log(1, Person.myTest);
// console.log(2, p1.myTest);
