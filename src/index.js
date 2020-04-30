function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    if (superClass)
        _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
            descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}


var MyDynamicComponent = function () {
    function MyDynamicComponent() {
        _classCallCheck(this, MyDynamicComponent);

        // console.log(1, this);
        // console.log(2, this.ngOnInit);
        // delete this.ngOnInit;
    }

    _createClass(MyDynamicComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
            console.log('dy init work!');
        }
    }]);

    return MyDynamicComponent;
}();

// MyDynamicComponent.ɵfac = function MyDynamicComponent_Factory(t) {
//     return new (t || MyDynamicComponent)();
// };


var HomeComponent = function (_MyDynamicComponent) {
    _inherits(HomeComponent, _MyDynamicComponent);
    function HomeComponent() {
        _classCallCheck(this, HomeComponent);

        return _possibleConstructorReturn(this, _getPrototypeOf(HomeComponent).call(this));
    }

    _createClass(HomeComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
            console.log('home init work!');
        }
    }]);

    return HomeComponent;
}(MyDynamicComponent);

// HomeComponent.ɵfac = function HomeComponent_Factory(t) {
//     return new (t || HomeComponent)();
// };


let h = new HomeComponent();
h.ngOnInit();
// console.log(1, h);
// console.log(1, MyDynamicComponent.prototype);
// console.log(2, HomeComponent.prototype);



