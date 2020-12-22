/*
@license

dhtmlxGantt v.6.2.7 Professional

This software is covered by DHTMLX Ultimate License. Usage without proper license is prohibited.

(c) XB Software Ltd.

*/
Gantt.plugin(function(gantt){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/sources/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/overlay.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/overlay.js":
/*!********************************!*\
  !*** ./sources/ext/overlay.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
	if (!gantt.ext) {
		gantt.ext = {};
	}

	gantt.ext.overlay = {};

	var overlays = {};

	gantt.config.show_overlays = true;

	function createOverlay(id, render) {
		var div = document.createElement("div");
		div.setAttribute("data-overlay-id", id);
		var css = "gantt_overlay";
		div.className = css;
		div.style.display = "none";
		return {
			id: id,
			render: render,
			isVisible: false,
			isAttached: false,
			node: div
		};
	}

	function initOverlayArea() {
		if(!gantt.$task_data) {
			return;
		}
		gantt.event(gantt.$task_data, "scroll", function(e){
			if (!gantt.ext.$overlay_area) {
				return;
			}
			gantt.ext.$overlay_area.style.top = e.target.scrollTop + "px";
		});
		var overlayArea = document.createElement("div");
		overlayArea.className = "gantt_overlay_area";
		gantt.$task_data.appendChild(overlayArea);
		gantt.ext.$overlay_area = overlayArea;

		attachUnnattached();
	}

	function attachUnnattached(){
		for(var i in overlays){
			var overlay = overlays[i];
			if(!overlay.isAttached){
				attachOverlay(overlay);
			}
		}
	}

	function attachOverlay(overlay){
		gantt.ext.$overlay_area.appendChild(overlay.node);
		overlay.isAttached = true;
	}

	function showOverlayArea(){
		gantt.ext.$overlay_area.style.display = "block";
	}

	function hideIfNoVisibleLayers(){
		var any = false;
		for(var i in overlays){
			var overlay = overlays[i];
			if(overlay.isVisible){
				any = true;
				break;
			}
		}

		if(!any){
			gantt.ext.$overlay_area.style.display = "none";
		}
	}

	gantt.attachEvent("onBeforeGanttRender", function() {
		if (!gantt.ext.$overlay_area) {
			initOverlayArea();
		}
		attachUnnattached();
		hideIfNoVisibleLayers();
	});

	gantt.attachEvent("onGanttReady", function() {
		initOverlayArea();
		attachUnnattached();
		hideIfNoVisibleLayers();
	});

	gantt.ext.overlay.addOverlay = function(render, id) {
		var id = id || gantt.uid();
		overlays[id] = createOverlay(id, render);
		return id;
	};

	gantt.ext.overlay.deleteOverlay = function(id) {
		if (!overlays[id])
			return false;

		delete overlays[id];
		hideIfNoVisibleLayers();
		return true;
	};

	gantt.ext.overlay.getOverlaysIds = function() {
		var ids = [];
		for(var i in overlays){
			ids.push(i);
		}
		return ids;
	};

	gantt.ext.overlay.refreshOverlay = function(id) {
		showOverlayArea();
		overlays[id].isVisible = true;
		overlays[id].node.innerHTML = "";
		overlays[id].node.style.display = "block";
		overlays[id].render(overlays[id].node);
	};

	gantt.ext.overlay.showOverlay = function(id) {
		showOverlayArea();
		this.refreshOverlay(id);
	};

	gantt.ext.overlay.hideOverlay = function(id) {

		overlays[id].isVisible = false;
		overlays[id].node.style.display = "none";
		hideIfNoVisibleLayers();
	};
	gantt.ext.overlay.isOverlayVisible = function(id) {
		if (!id) {
			return false;
		}
		return overlays[id].isVisible;
	};
})();

/***/ })

/******/ });
});
});