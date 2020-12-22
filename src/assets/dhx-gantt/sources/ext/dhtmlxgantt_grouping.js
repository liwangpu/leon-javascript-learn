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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/grouping.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/grouping.js":
/*!*********************************!*\
  !*** ./sources/ext/grouping.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(/*! ../utils/helpers */ "./sources/utils/helpers.js");

gantt._groups = {
	relation_property: null,
	relation_id_property: '$group_id',
	group_id: null,
	group_text: null,
	loading: false,
	loaded: 0,
	dynamicGroups: false,
	set_relation_value: undefined,
	init: function(gantt){
		var self = this;

		gantt.attachEvent("onClear", function(){
			self.clear();
		});
		self.clear();

		var originalGetParent = gantt.$data.tasksStore.getParent; // gantt._get_parent_id;

		gantt.attachEvent("onBeforeTaskMove", function() {
			if (this._groups.dynamicGroups) {
				return false;
			}
			return true;
		});

		gantt.$data.tasksStore._listenerToDrop = gantt.$data.tasksStore.attachEvent("onStoreUpdated", gantt.bind(_initBeforeDataRender, gantt));

		gantt.$data.tasksStore.getParent = function(task) {
			if (self.is_active()) {
				return self.get_parent(gantt, task);
			} else {
				return originalGetParent.apply(this, arguments);
			}
		};

		var originalSetParent = gantt.$data.tasksStore.setParent;

		gantt.$data.tasksStore.setParent = function(task, new_pid) {
			if (!self.is_active()) {
				return originalSetParent.apply(this, arguments);
			} else if (self.set_relation_value instanceof Function && gantt.isTaskExists(new_pid)) {
				var parent = gantt.getTask(new_pid);
				var groupIds = parent[self.relation_id_property];
				if (task[self.group_id] === undefined)
					task[self.group_id] = groupIds; // to avoid nulling of relation_property if the group is not set

				if (groupIds){
					if (typeof groupIds == "string"){
						groupIds = groupIds.split(",");
					} else {
						groupIds = [groupIds];
					}
				}
				task[self.relation_property] = self.set_relation_value(groupIds) || groupIds;
				
			} else if (gantt.isTaskExists(new_pid)) {
				var parent = gantt.getTask(new_pid);

				if (!self.dynamicGroups) {
					task[self.relation_property] = parent[self.relation_id_property];
				}
				this._setParentInner.apply(this, arguments);
			} else if(self.dynamicGroups) {
				if (task[self.group_id] === undefined) {
					task[self.relation_property] = [];
				}
			}
		};

		gantt.attachEvent("onBeforeTaskDisplay", function(id, task){
			if(self.is_active()){
				if(task.type == gantt.config.types.project && !task.$virtual)
					return false;
			}
			return true;
		});

		gantt.attachEvent("onBeforeParse", function(){
			self.loading = true;
		});

		gantt.attachEvent("onTaskLoading", function(){
			if(self.is_active()){
				self.loaded--;
				if(self.loaded <= 0){
					self.loading = false;
					gantt.eachTask(gantt.bind(function(t){
						this.get_parent(gantt, t);
					}, self));
				}
			}
			return true;

		});
		gantt.attachEvent("onParse", function(){
			self.loading = false;
			self.loaded = 0;
		});
	},

	get_parent: function(gantt, task, tasks) {
		if (task.id === undefined) {
			task = gantt.getTask(task);
		}

		var group_id = _getGroupId(task, this.relation_property);


		if (this._groups_pull[group_id] === task.id){
			return gantt.config.root_id;
		}
		if (this._groups_pull[group_id] !== undefined) {
			return this._groups_pull[group_id];
		}

		var parent_id = gantt.config.root_id;

		if (!this.loading && group_id !== undefined) {
			parent_id = this.find_parent(tasks || gantt.getTaskByTime(), group_id, this.relation_id_property, gantt.config.root_id, task);
			this._groups_pull[group_id] = parent_id;
		}

		return parent_id;
	},
	find_parent: function(tasks, group_id, relation, root, searchTask){
		for(var i = 0; i < tasks.length; i++){
			var task = tasks[i];
			if(task[relation] !== undefined && task[relation] == group_id && task.id !== searchTask.id){
				return task.id;
			}
		}
		return root;
	},
	clear: function(){
		this._groups_pull = {};
		this.relation_property = null;
		this.group_id = null;
		this.group_text = null;
	},
	is_active: function(){
		return !!(this.relation_property);
	},
	generate_sections: function(list, groups_type){
		var groups = [];
		for(var i = 0; i < list.length; i++){
			var group = gantt.copy(list[i]);
			group.type = groups_type;
			group.open = true;
			group.$virtual = true;
			group.readonly = true;
			group[this.relation_id_property] = group[this.group_id];
			group.text = group[this.group_text];
			groups.push(group);
		}
		return groups;

	},
	clear_temp_tasks: function(tasks){
		for(var i =0; i < tasks.length; i++){
			if(tasks[i].$virtual){
				tasks.splice(i, 1);
				i--;
			}
		}
	},

	generate_data: function(gantt, groups){
		var links = gantt.getLinks();
		var tasks = gantt.getTaskByTime();

		this.clear_temp_tasks(tasks);

		var categories = [];
		if(this.is_active() && groups && groups.length){
			categories = this.generate_sections(groups, gantt.config.types.project);
		}

		var data = {links: links};
		data.data = categories.concat(tasks);

		return data;
	},
	update_settings: function(relation, group_id, group_text){
		this.clear();
		this.relation_property = relation;
		this.group_id = group_id;
		this.group_text = group_text;
	},
	group_tasks: function (gantt, groups_array, relation_property, group_id, group_text){
		this.update_settings(relation_property, group_id, group_text);
		var data = this.generate_data(gantt, groups_array);
		this.loaded = data.data.length;
		gantt._clear_data();
		gantt.parse(data);
	}
};

gantt._groups.init(gantt);
gantt.groupBy = function(config) {
	var _this = this;
	var tasks = gantt.getTaskByTime();

	this._groups.set_relation_value = config.set_relation_value;
	
	this._groups.dynamicGroups = helpers.arraySome(
		tasks,
		function(entry, index) {
			return entry[config.relation_property] instanceof Array;
		}
	);

	config = config || {};
	config.default_group_label = config.default_group_label || this.locale.labels.default_group || "None";

	var relation_property = config.relation_property || null;
	var group_id = config.group_id || "key";
	var group_text = config.group_text || "label";

	this._groups.regroup = function() {
		var tasks = gantt.getTaskByTime();
		var groups = _initGroups(config, tasks, gantt);

		_this._groups.group_tasks(_this, groups, relation_property, group_id, group_text);
		return true;
	};
	this._groups.regroup();
};

function _initGroups(config, tasks, gantt) {
	var groups;
	if (config.groups) {
		if (gantt._groups.dynamicGroups) {
			groups = _getGroupForMultiItems(tasks, config);
		} else {
			groups = config.groups;
		}

	} else {
		groups = null;
	}
	return groups;
}

function _getResourcesIds(resourses){
	return helpers.arrayMap(resourses, function(entry, index) {
		if(entry && typeof entry == "object"){
			return String(entry.resource_id);
		}else{
			return String(entry);
		}
	}).sort().join(",");
}

function _getGroupId(task, relationProperty) {
	var group_id;

	if (task[relationProperty] instanceof Array) {
		group_id = _getResourcesIds(task[relationProperty]);
	} else {
		group_id = task[relationProperty];
	}
	return group_id;
}

function _getGroupForMultiItems(tasks, config) {
	var resultObj = {};
	var result = [];
	var itemsByKey = {};
	var property = config.relation_property;
	var delimiter = config.delimiter || ",";

	var hasDefaultGroup = false;
	var defaultGroupId = 0;

	helpers.forEach(config.groups, function(entry) {
		if(entry.default){
			hasDefaultGroup = true;
			defaultGroupId = entry.group_id;
		}
		itemsByKey[entry.key || entry[config.group_id]] = entry;
	});

	for (var i=0; i < tasks.length; i++) {
		var key;
		var label;

		if (helpers.isArray(tasks[i][property])) {
			if(tasks[i][property].length > 0) {
			key = _getResourcesIds(tasks[i][property]);
			label = helpers.arrayMap(
				tasks[i][property],
				function(entry, index) {

					var key;
					if (entry && typeof entry == "object") {
						key = entry.resource_id;
					} else {
						key = entry;
					}
					entry = itemsByKey[key];
					return entry.label || entry.text;
				}
			).sort().join(delimiter);
			} else {
				if(hasDefaultGroup)
					continue;
				key = 0;
				label = config.default_group_label;
			}
		} else if (tasks[i][property]) {
			key = tasks[i][property];
			label = itemsByKey[key].label || itemsByKey[key].text;
		} else {
			if(hasDefaultGroup)
				continue;
			key = 0;
			label = config.default_group_label;
		}
		if (key === undefined || resultObj[key] !== undefined) {
			continue;
		}
		resultObj[key] = { key: key, label: label };
		if(key === defaultGroupId){
			resultObj[key].default = true;
		}
		resultObj[key][config.group_text] = label;
		resultObj[key][config.group_id] = key;
	}
	result = helpers.hashToArray(resultObj);
	result.forEach(function(group){
		if(group.key == defaultGroupId){
			group.default = true;
		}
	});
	return result;
}

var state = gantt.$services.getService("state");
state.registerProvider("groupBy", function () {
	return { 
		group_mode: gantt._groups.is_active() ? gantt._groups.relation_property : null
	};
});

function _initBeforeDataRender() {
	var _this = this;
	if (this.$data.tasksStore._listenerToDrop) { 
		this.$data.tasksStore.detachEvent(this.$data.tasksStore._listenerToDrop);
	}

	// updateTask can be called many times from batchUpdate or autoSchedule, 
	// add a delay in order to perform grouping only once when everything is done
	this.$data.tasksStore.attachEvent("onAfterUpdate", helpers.delay(function() {
		if (!_this._groups.dynamicGroups) {
			return true;
		}
		if (_this._groups.regroup) {
			_this._groups.regroup();
		}
		return true;
	}));
}

/***/ }),

/***/ "./sources/utils/helpers.js":
/*!**********************************!*\
  !*** ./sources/utils/helpers.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var units = {
	"second": 1,
	"minute": 60,
	"hour": 60 * 60,
	"day": 60 * 60 * 24,
	"week": 60 * 60 * 24 * 7,
	"month": 60 * 60 * 24 * 30,
	"quarter": 60 * 60 * 24 * 30 * 3,
	"year": 60 * 60 * 24 * 365
};
function getSecondsInUnit(unit){
	return units[unit] || units.hour;
}

function forEach(arr, callback) {
	if (arr.forEach) {
		arr.forEach(callback);
	} else {
		var workArray = arr.slice();
		for (var i = 0; i < workArray.length; i++) {
			callback(workArray[i], i);
		}
	}
}

function arrayMap(arr, callback) {
	if (arr.map) {
		return arr.map(callback);
	} else {
		var workArray = arr.slice();
		var resArray = [];

		for (var i = 0; i < workArray.length; i++) {
			resArray.push(callback(workArray[i], i));
		}
		return resArray;
	}
}


function arrayFind(arr, callback) {
	if (arr.find) {
		return arr.find(callback);
	} else {
		for (var i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				return arr[i];
			}
		}
	}
}

// iframe-safe array type check instead of using instanceof
function isArray(obj){
	if(Array.isArray){
		return Array.isArray(obj);
	}else{
		// close enough
		return (obj && obj.length !== undefined && obj.pop && obj.push);
	}
}

// non-primitive string object, e.g. new String("abc")
function isStringObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function String() { [native code] }";
}

// non-primitive number object, e.g. new Number(5)
function isNumberObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function Number() { [native code] }";
}

// non-primitive number object, e.g. new Boolean(true)
function isBooleanObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function Boolean() { [native code] }";
}

function isDate(obj) {
	if (obj && typeof obj === "object") {
		return !!(obj.getFullYear && obj.getMonth && obj.getDate);
	} else {
		return false;
	}
}

function arrayFilter(arr, callback) {
	var result = [];

	if (arr.filter) {
		return arr.filter(callback);
	} else {
		for (var i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				result[result.length] = arr[i];
			}
		}
		return result;
	}
}

function hashToArray(hash) {
	var result = [];

	for (var key in hash) {
		if (hash.hasOwnProperty(key)) {
			result.push(hash[key]);
		}
	}

	return result;
}

function arraySome(arr, callback) {
	if (arr.length === 0) return false;

	for (var i = 0; i < arr.length; i++) {
		if (callback(arr[i], i, arr)) {
			return true;
		}
	}
	return false;
}

function arrayDifference(arr, callback) {
	return arrayFilter(arr, function(item, i) {
		return !callback(item, i);
	});
}

function throttle (callback, timeout) {
	var wait = false;

	return function () {
		if (!wait) {
			callback.apply(null, arguments);
			wait = true;
			setTimeout(function () {
				wait = false;
			}, timeout);
		}
	};
}

function delay (callback, timeout){
	var timer;

	var result = function() {
		result.$cancelTimeout();
		callback.$pending = true;
		var args = Array.prototype.slice.call(arguments);
		timer = setTimeout(function(){
			callback.apply(this, args);
			result.$pending = false;
		}, timeout);
	};
	
	result.$pending = false;
	result.$cancelTimeout = function(){
		clearTimeout(timer);
		callback.$pending = false;
	};
	result.$execute = function(){
		callback();
		callback.$cancelTimeout();
	};

	return result;
}

function sortArrayOfHash(arr, field, desc) {
	var compare = function(a, b) {
		return a < b;
	};

	arr.sort(function(a, b) {
		if (a[field] === b[field]) return 0;

		return desc ? compare(a[field], b[field]) : compare(b[field], a[field]);
	});
}

function objectKeys(obj) {
	if (Object.keys) {
		return Object.keys(obj);
	}
	var result = [];
	var key;
	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result.push(key);
		}
	}
	return result;
}

function requestAnimationFrame(callback) {
	var w = window;
	var foundRequestAnimationFrame = w.requestAnimationFrame
		|| w.webkitRequestAnimationFrame
		|| w.msRequestAnimationFrame
		|| w.mozRequestAnimationFrame
		|| w.oRequestAnimationFrame
		|| function(cb) { setTimeout(cb, 1000/60); };
	return foundRequestAnimationFrame(callback);
}

function isEventable(obj) {
	return obj.attachEvent && obj.detachEvent;
}

module.exports = {
	getSecondsInUnit: getSecondsInUnit,
	forEach: forEach,
	arrayMap: arrayMap,
	arrayFind: arrayFind,
	arrayFilter: arrayFilter,
	arrayDifference: arrayDifference,
	arraySome: arraySome,
	hashToArray: hashToArray,
	sortArrayOfHash: sortArrayOfHash,
	throttle: throttle,
	isArray: isArray,
	isDate: isDate,
	isStringObject: isStringObject,
	isNumberObject: isNumberObject,
	isBooleanObject: isBooleanObject,
	delay: delay,
	objectKeys: objectKeys,
	requestAnimationFrame: requestAnimationFrame,
	isEventable: isEventable
};

/***/ })

/******/ });
});
});