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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/critical_path.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/core/relations/graph_helper.js":
/*!************************************************!*\
  !*** ./sources/core/relations/graph_helper.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(/*! ../../utils/helpers */ "./sources/utils/helpers.js");

module.exports = function(){
	return {
		getVertices: function(relations){
			var ids = {};
			var rel;
			for(var i = 0, len = relations.length; i < len; i++){
				rel = relations[i];
				ids[rel.target] = rel.target;
				ids[rel.source] = rel.source;
			}

			var vertices = [];
			var id;
			for(var i in ids){
				id = ids[i];
				vertices.push(id);
			}

			return vertices;
		},
		topologicalSort: function(edges){
			var vertices = this.getVertices(edges);
			var hash = {};

			for(var i = 0, len = vertices.length; i < len; i ++){
				hash[vertices[i]] = {id: vertices[i], $source:[], $target:[], $incoming: 0};
			}

			for(var i = 0, len = edges.length; i < len; i++){
				var successor = hash[edges[i].target];
				successor.$target.push(i);
				successor.$incoming = successor.$target.length;
				hash[edges[i].source].$source.push(i);

			}

			// topological sort, Kahn's algorithm
			var S = vertices.filter(function(v){ return !hash[v].$incoming; });

			var L = [];

			while(S.length){
				var n = S.pop();

				L.push(n);

				var node = hash[n];

				for(var i = 0; i < node.$source.length; i++){
					var m = hash[edges[node.$source[i]].target];
					m.$incoming--;
					if(!m.$incoming){
						S.push(m.id);
					}

				}
			}

			return L;

		},
		groupAdjacentEdges: function(edges){
			var res = {};
			var edge;
			for(var i = 0, len = edges.length; i < len; i++){
				edge = edges[i];
				if(!res[edge.source]){
					res[edge.source] = [];
				}
				res[edge.source].push(edge);
			}
			return res;
		},
		tarjanStronglyConnectedComponents: function(vertices, edges){
			//https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
			// iterative implementation
			var verticesHash = {};
			var stack = [];
			var edgesFromTasks = this.groupAdjacentEdges(edges);
			var recurse = false;
			var connectedComponents = [];

			for(var i = 0; i < vertices.length; i++){
				var root = getVertex(vertices[i]);
				if(root.visited) continue;
				var workStack = [root];
				var index = 0;
				while(workStack.length){
					var v = workStack.pop();

					if(!v.visited){
						v.index = index;
						v.lowLink = index;
						index++;
						stack.push(v);
						v.onStack = true;
						v.visited = true;
					}
					recurse = false;
					var edges = edgesFromTasks[v.id] || [];
					for(var e = 0; e < edges.length; e++){
						var w = getVertex(edges[e].target);
						w.edge = edges[e];
						if(w.index === undefined){
							workStack.push(v);
							workStack.push(w);
							recurse = true;
							break;
						}else if(w.onStack){
							v.lowLink = Math.min(v.lowLink, w.index);
						}
					}
					if(recurse)
						continue;

					if (v.index == v.lowLink){
						var com = {tasks:[], links:[]};
						while(true){
							w = stack.pop();
							w.onStack = false;
							com.tasks.push(w.id);
							if(w.edge){
								com.links.push(w.edge.id);
							}
							if(w == v){
								break;
							}
						}

						connectedComponents.push(com);
					}
					if(workStack.length){
						w = v;
						v = workStack[workStack.length - 1];
						v.lowLink = Math.min(v.lowLink, w.lowLink);
					}
				}

			}

			return connectedComponents;

			function getVertex(id){
				if(!verticesHash[id]){
					verticesHash[id] = {id: id, onStack:false, index: undefined, lowLink: undefined, edge: undefined};
				}

				return verticesHash[id];
			}
		},

		findLoops: function(relations){
			var cycles = [];

			helpers.forEach(relations, function(rel){
				if(rel.target == rel.source)
					cycles.push([rel.target, rel.source]);
			});

			var vertices = this.getVertices(relations);

			var connectedComponents = this.tarjanStronglyConnectedComponents(vertices, relations);
			helpers.forEach(connectedComponents, function(component){
				if(component.tasks.length > 1){
					cycles.push(component);//{ tasks: [task ids], links: [links ids]}
				}
			});

			return cycles;
			//{task:id, link:link.type, lag: link.lag || 0, source: link.source}
		}
	};
};

/***/ }),

/***/ "./sources/core/relations/links_builder.js":
/*!*************************************************!*\
  !*** ./sources/core/relations/links_builder.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	return {
		getVirtualRoot: function(){
			return gantt.mixin(
				gantt.getSubtaskDates(),
				{
					id: gantt.config.root_id,
					type: gantt.config.types.project,
					$source: [],
					$target: [],
					$virtual: true
				}
			);
		},
	
		getLinkedTasks: function(id, includePredecessors){
			var startIds = [id];
	
			//TODO: format links cache
			var clearCache = false;
			if(!gantt._isLinksCacheEnabled()) {
				gantt._startLinksCache();
				clearCache = true;
			}
			var relations = [];
			var visited = {};
			var result = {};
			for(var i = 0; i < startIds.length; i++){
				this._getLinkedTasks(startIds[i], visited, includePredecessors, result);
			}
	
			for(var i in result){
				relations.push(result[i]);
			}
	
			//TODO: remove redundant edges before continue https://en.wikipedia.org/wiki/Transitive_reduction
			if(clearCache)
				gantt._endLinksCache();
			return relations;
		},
	
		_collectRelations: function(rootObj, isChild, includePredecessors, visitedLinks){
			var successors = gantt._getSuccessors(rootObj, isChild);
	
			var predecessors = [];
			if (includePredecessors) {
				predecessors = gantt._getPredecessors(rootObj, isChild);
			}
			
			var linkKey;
			var relations = [];
			for(var i = 0; i < successors.length; i++){
				linkKey = successors[i].hashSum;
				if(visitedLinks[linkKey]) {
					continue;
				}else{
					visitedLinks[linkKey] = true;
					relations.push(successors[i]);
				}
			}
			for(var i = 0; i < predecessors.length; i++){
				linkKey = predecessors[i].hashSum;
				if(visitedLinks[linkKey]) {
					continue;
				}else{
					visitedLinks[linkKey] = true;
					relations.push(predecessors[i]);
				}
			}
			return relations;
		},
		_getLinkedTasks: function(rootTask, visitedTasks, includePredecessors, output) {
			var from = rootTask === undefined ? gantt.config.root_id : rootTask;
			var visitedTasks = {};
			var visitedLinks = {};
			var rootObj;
	
			var tasksStack = [{from: from, includePredecessors: includePredecessors, isChild:false}];
	
			while(tasksStack.length){
				var current = tasksStack.pop();
				var isChild = current.isChild;
	
				from = current.from;
				if(visitedTasks[from]){
					continue;
				}
				
				rootObj = gantt.isTaskExists(from) ? gantt.getTask(from) : this.getVirtualRoot();
				visitedTasks[from] = true;
				
				var relations = this._collectRelations(rootObj, isChild, includePredecessors, visitedLinks);
	
				for(var i=0; i < relations.length; i++){
					var rel = relations[i];
					output[rel.hashSum] = rel;
					var isSameParent = rel.sourceParent == rel.targetParent;
					var targetTask = rel.target;
					if(!visitedTasks[targetTask])
						tasksStack.push({from: rel.target, includePredecessors: true, isChild: isSameParent});
				}
	
				if(gantt.hasChild(rootObj.id)){
					var children = gantt.getChildren(rootObj.id);
					for(var i=0; i < children.length; i++){
						if(!visitedTasks[children[i]])
							tasksStack.push({from: children[i], includePredecessors: true, isChild: true});
					}
				}
			}
	
			return output;
		}
	};
};

/***/ }),

/***/ "./sources/core/relations/links_common.js":
/*!************************************************!*\
  !*** ./sources/core/relations/links_common.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (gantt) {
	// helpers for building chain of dependencies, used for critical path calculation and for auto scheduling

	gantt._get_linked_task = function (link, getTarget) {
		var task = null;
		var taskId = getTarget ? link.target : link.source;

		if (gantt.isTaskExists(taskId)) {
			task = gantt.getTask(taskId);
		}

		return task;
	};
	gantt._get_link_target = function (link) {
		return gantt._get_linked_task(link, true);
	};

	gantt._get_link_source = function (link) {
		return gantt._get_linked_task(link, false);
	};

	var caching = false;
	var formattedLinksStash = {};
	var inheritedSuccessorsStash = {};
	var inheritedPredecessorsStash = {};
	var getPredecessorsCache = {};


	gantt._isLinksCacheEnabled = function () {
		return caching;
	};
	gantt._startLinksCache = function () {
		formattedLinksStash = {};
		inheritedSuccessorsStash = {};
		inheritedPredecessorsStash = {};
		getPredecessorsCache = {};
		caching = true;
	};
	gantt._endLinksCache = function () {
		formattedLinksStash = {};
		inheritedSuccessorsStash = {};
		inheritedPredecessorsStash = {};
		getPredecessorsCache = {};
		caching = false;
	};

	gantt._formatLink = function (link) {


		if (caching && formattedLinksStash[link.id]) {
			return formattedLinksStash[link.id];
		}

		var relations = [];
		var target = this._get_link_target(link);
		var source = this._get_link_source(link);

		if (!(source && target)) {
			return relations;
		}

		if ((gantt.isSummaryTask(target) && gantt.isChildOf(source.id, target.id)) || (gantt.isSummaryTask(source) && gantt.isChildOf(target.id, source.id))) {
			return relations;
		}


		// there are three kinds of connections at this point
		// task -> task - regular link
		// task -> project - transform it into set of regular links (task -> [each subtask]), use offset beetween subtask and project dates as lag, in order not to change mutual positions of subtasks inside a project
		// project -> task - transform it into ([each subtask] -> task) links
		// project -> project - transform it into ([each subtask of p1] -> [each subtask of p2]) links

		var from = this._getImplicitLinks(link, source, function (c) {
			return 0;
		}, true);

		var respectTargetOffset = gantt.config.auto_scheduling_move_projects;
		var targetDates = this.isSummaryTask(target) ? this.getSubtaskDates(target.id) : {
			start_date: target.start_date,
			end_date: target.end_date
		};
		var to = this._getImplicitLinks(link, target, function (c) {
			if (!respectTargetOffset) {
				return 0;
			} else {

				if (!c.$target.length && !(gantt.getState().drag_id == c.id)) {// drag_id - virtual lag shouldn't restrict task that is being moved inside project
					return gantt.calculateDuration({
						start_date: targetDates.start_date,
						end_date: c.start_date,
						task: source
					});
				} else {
					return 0;
				}
			}
		});

		for (var i = 0, fromLength = from.length; i < fromLength; i++) {
			var fromTask = from[i];
			for (var j = 0, toLength = to.length; j < toLength; j++) {
				var toTask = to[j];

				var lag = fromTask.lag * 1 + toTask.lag * 1;

				var subtaskLink = {
					id: link.id,
					type: link.type,
					source: fromTask.task,
					target: toTask.task,
					lag: (link.lag * 1 || 0) + lag
				};

				relations.push(gantt._convertToFinishToStartLink(toTask.task, subtaskLink, source, target, fromTask.taskParent, toTask.taskParent));
			}
		}

		if (caching)
			formattedLinksStash[link.id] = relations;

		return relations;
	};

	gantt._isAutoSchedulable = function (task) {
		return task.auto_scheduling !== false;
	};

	gantt._getImplicitLinks = function (link, parent, selectOffset, selectSourceLinks) {
		var relations = [];

		if (this.isSummaryTask(parent)) {

			// if the summary task contains multiple chains of linked tasks - no need to consider every task of the chain,
			// it will be enough to check the first/last tasks of the chain
			// special conditions if there are unscheduled tasks in the chain, or negative lag values that put the end date of the successor task prior to its predecessors' date
			var children = {};
			this.eachTask(function (c) {
				if (!this.isSummaryTask(c)) {
					children[c.id] = c;
				}
			}, parent.id);

			var skipChild;

			for (var c in children) {
				var task = children[c];
				var linksCollection = selectSourceLinks ? task.$source : task.$target;

				skipChild = false;

				for (var l = 0; l < linksCollection.length; l++) {
					var siblingLink = gantt.getLink(linksCollection[l]);
					var siblingId = selectSourceLinks ? siblingLink.target : siblingLink.source;
					var siblingTask = children[siblingId];
					if (siblingTask && task.auto_scheduling !== false && siblingTask.auto_scheduling !== false) {
						if ((siblingLink.target == siblingTask.id && Math.abs(siblingLink.lag) <= siblingTask.duration) ||
							(siblingLink.target == task.id && Math.abs(siblingLink.lag) <= task.duration)) {
							skipChild = true;
							break;
						}
					}
				}
				if (!skipChild) {
					relations.push({ task: task.id, taskParent: task.parent, lag: selectOffset(task) });
				}
			}

		} else {
			relations.push({ task: parent.id, taskParent: parent.parent, lag: 0 });
		}

		return relations;
	};

	gantt._getDirectDependencies = function (task, selectSuccessors) {

		var links = [],
			successors = [];

		var linksIds = selectSuccessors ? task.$source : task.$target;

		for (var i = 0; i < linksIds.length; i++) {
			var link = this.getLink(linksIds[i]);
			if (this.isTaskExists(link.source) && this.isTaskExists(link.target)) {
				var target = this.getTask(link.target);
				if (this._isAutoSchedulable(target)) {
					links.push(this.getLink(linksIds[i]));
				}
			}
		}

		for (var i = 0; i < links.length; i++) {
			successors = successors.concat(this._formatLink(links[i]));
		}

		return successors;
	};

	gantt._getInheritedDependencies = function (task, selectSuccessors) {

		//var successors = [];
		var stop = false;
		var inheritedRelations = [];
		var cacheCollection;
		if (this.isTaskExists(task.id)) {
			this.eachParent(function (parent) {
				if (stop)
					return;

				if (caching) {
					cacheCollection = selectSuccessors ? inheritedSuccessorsStash : inheritedPredecessorsStash;
					if (cacheCollection[parent.id]) {
						inheritedRelations = inheritedRelations.concat(cacheCollection[parent.id]);
						return;
					}
				}

				var parentDependencies;
				if (this.isSummaryTask(parent)) {
					if (!this._isAutoSchedulable(parent)) {
						stop = true;
					} else {
						parentDependencies = this._getDirectDependencies(parent, selectSuccessors);
						if (caching) {
							cacheCollection[parent.id] = parentDependencies;
						}
						
						inheritedRelations = inheritedRelations.concat(parentDependencies);
					}
				}

			}, task.id, this);
		}

		return inheritedRelations;
	};


	gantt._getDirectSuccessors = function (task) {
		return this._getDirectDependencies(task, true);
	};

	gantt._getInheritedSuccessors = function (task) {
		return this._getInheritedDependencies(task, true);
	};

	gantt._getDirectPredecessors = function (task) {
		return this._getDirectDependencies(task, false);
	};

	gantt._getInheritedPredecessors = function (task) {
		return this._getInheritedDependencies(task, false);
	};

	gantt._getSuccessors = function (task, skipInherited) {
		var successors = this._getDirectSuccessors(task);
		if (skipInherited) {
			return successors;
		} else {
			return successors.concat(this._getInheritedSuccessors(task));
		}
	};

	gantt._getPredecessors = function (task, skipInherited) {
		var key = task.id + skipInherited;
		var result;

		if (caching && getPredecessorsCache[key]) {
			return getPredecessorsCache[key];
		}

		var predecessors = this._getDirectPredecessors(task);
		if (skipInherited) {
			result = predecessors;
		} else {
			result = predecessors.concat(this._getInheritedPredecessors(task));
		}
		if (caching) {
			getPredecessorsCache[key] = result;
		}
		return result;
	};


	gantt._convertToFinishToStartLink = function (id, link, sourceTask, targetTask, sourceParent, targetParent) {
		// convert finish-to-finish, start-to-finish and start-to-start to finish-to-start link and provide some additional properties
		var res = {
			target: id,
			link: gantt.config.links.finish_to_start,
			id: link.id,
			lag: link.lag || 0,
			source: link.source,
			preferredStart: null,
			sourceParent: sourceParent,
			targetParent: targetParent,
			hashSum: null
		};

		var additionalLag = 0;
		switch (link.type) {
			case gantt.config.links.start_to_start:
				additionalLag = -sourceTask.duration;
				break;
			case gantt.config.links.finish_to_finish:
				additionalLag = -targetTask.duration;
				break;
			case gantt.config.links.start_to_finish:
				additionalLag = -sourceTask.duration - targetTask.duration;
				break;
			default:
				additionalLag = 0;
		}

		res.lag += additionalLag;
		res.hashSum = res.lag + "_" + res.link + "_" + res.source + "_" + res.target;
		return res;
	};
};

/***/ }),

/***/ "./sources/ext/critical_path.js":
/*!**************************************!*\
  !*** ./sources/ext/critical_path.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../core/relations/links_common */ "./sources/core/relations/links_common.js")(gantt);

var _private = __webpack_require__(/*! ./critical_path/slack */ "./sources/ext/critical_path/slack.js")(gantt);
_private.init();

gantt.getFreeSlack = function(task) {
	return _private.getFreeSlack(task);
};

gantt.getTotalSlack = function(task) {
	return _private.getTotalSlack(task);
};

var criticalPath = __webpack_require__(/*! ./critical_path/critical_path */ "./sources/ext/critical_path/critical_path.js")(gantt);
gantt.config.highlight_critical_path = false;
criticalPath.init();

gantt.isCriticalTask = function (task) {
	gantt.assert(!!(task && task.id !== undefined), "Invalid argument for gantt.isCriticalTask");
	return criticalPath.isCriticalTask(task);
};

gantt.isCriticalLink = function (link) {
	return this.isCriticalTask(gantt.getTask(link.source));
};


gantt.getSlack = function(task1, task2) {
	var minSlack = 0;
	var relations = [];
	var common = {};

	for (var i = 0; i < task1.$source.length; i++) {
		common[task1.$source[i]] = true;
	}
	for (var i = 0; i < task2.$target.length; i++) {
		if(common[task2.$target[i]])
			relations.push(task2.$target[i]);
	}

	for (var i = 0; i < relations.length; i++) {
		var link = this.getLink(relations[i]);
		var newSlack = this._getSlack(task1, task2, this._convertToFinishToStartLink(link.id, link, task1, task2, task1.parent, task2.parent));

		if (minSlack > newSlack || i === 0) {
			minSlack = newSlack;
		}
	}

	return minSlack;
};

gantt._getSlack = function (task, next_task, relation) {
	// relation - link expressed as finish-to-start (gantt._convertToFinishToStartLink)
	var types = this.config.types;

	var from = null;
	if (this.getTaskType(task.type) == types.milestone) {
		from = task.start_date;
	} else {
		from = task.end_date;
	}

	var to = next_task.start_date;

	var duration = 0;
	if (+from > +to) {
		duration = -this.calculateDuration({start_date: to, end_date: from, task: task});
	} else {
		duration = this.calculateDuration({start_date: from, end_date: to, task: task});
	}

	var lag = relation.lag;
	if (lag && lag*1 == lag) {
		duration -= lag;
	}

	return duration;
};





/***/ }),

/***/ "./sources/ext/critical_path/critical_path.js":
/*!****************************************************!*\
  !*** ./sources/ext/critical_path/critical_path.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var linksBuilder = __webpack_require__(/*! ../../core/relations/links_builder */ "./sources/core/relations/links_builder.js")(gantt);
var graphHelper = __webpack_require__(/*! ../../core/relations/graph_helper */ "./sources/core/relations/graph_helper.js")(gantt);

module.exports = function(gantt){

	gantt._isProjectEnd = function(task) {
		return !(this._hasDuration({
			start_date: task.end_date,
			end_date: this._getProjectEnd(),
			task: task
		}));
	};

	return {
		_needRecalc: true,
		_cache: null,
		reset: function(){
			this._needRecalc = true;
			this._cache = null;
		},
		_isRecalcNeeded: function(){
			return this._needRecalc;
		},
		_getLinks: function(){
			var links = linksBuilder.getLinkedTasks();
			return graphHelper.groupAdjacentEdges(links);
		},
		_calculateBranch: function(task, path, criticalTasks, adjacentLinks){
			path[task.id] = true;
			if(criticalTasks[task.id] !== undefined){
				return;
			}
			var stack = [task];

			while(stack.length) {
				task = stack.pop();

				if(criticalTasks[task.id] || gantt._isProjectEnd(task)){
					criticalTasks[task.id] = true;
					while(stack.length){
						var task = stack.pop();
						criticalTasks[task.id] = true;
					}
				}else {
					criticalTasks[task.id] = false;
					var successors = adjacentLinks[task.id] || [];
					for (var i = 0; i < successors.length; i++) {

						var next = gantt.getTask(successors[i].target);
						if (gantt._getSlack(task, next, successors[i]) <= 0 && (!path[next.id] || criticalTasks[next.id])) {
							path[next.id] = true;

							stack.push(task);
							stack.push(next);
							break;
						}
					}
				}
			}
		},

		_calculateSummaryTasks: function(summaryHash, criticalHash){
			for(var i in criticalHash){
				if(criticalHash[i]){
					var parent = gantt.getParent(i);
					while(summaryHash[parent] === undefined && gantt.isTaskExists(parent)){
						summaryHash[parent] = true;
						parent = gantt.getParent(parent);
					}
				}
			}

			for(var i in summaryHash){
				criticalHash[i] = !!summaryHash[i];
			}
		},

		_calculate: function calculateCriticalPath(){
			var criticalTasks = {};
			var clearCache = false;
			var path = {};
			if(!gantt._isLinksCacheEnabled()) {
				gantt._startLinksCache();
				clearCache = true;
			}
			var links = this._getLinks();

			var summaryTasks = {};
			gantt.eachTask(function(task){
				if(path[task.id])
					return;
				if(gantt.isSummaryTask(task)){
					summaryTasks[task.id] = undefined;
				}else{
					this._calculateBranch(task, path, criticalTasks, links);
				}
			}, gantt.config.root_id, this);

			this._calculateSummaryTasks(summaryTasks, criticalTasks);

			if(clearCache)
				gantt._endLinksCache();
			return criticalTasks;
		},

		isCriticalTask: function(task) {
			if(!task) return false;

			if(this._isRecalcNeeded()){
				this._cache = this._calculate();
				this._needRecalc = false;
			}

			return this._cache[task.id];
		},

		init: function(){
			var resetCache = gantt.bind(function(){
				this.reset();
				return true;
			}, this);

			var handleTaskIdChange = gantt.bind(function (oldId, newId) {
				if (this._cache) {
					this._cache[newId] = this._cache[oldId];
					delete this._cache[oldId];
				}
				return true;
			}, this);

			gantt.attachEvent("onAfterLinkAdd", resetCache);
			gantt.attachEvent("onAfterLinkUpdate", resetCache);
			gantt.attachEvent("onAfterLinkDelete", resetCache);
			gantt.attachEvent("onAfterTaskAdd", resetCache);
			gantt.attachEvent("onTaskIdChange", handleTaskIdChange);
			gantt.attachEvent("onAfterTaskUpdate", resetCache);
			gantt.attachEvent("onAfterTaskDelete", resetCache);
			gantt.attachEvent("onParse", resetCache);
			gantt.attachEvent("onClearAll", resetCache);


			var criticalPathHandler = function(){
				if(gantt.config.highlight_critical_path)
					gantt.render();
			};
			gantt.attachEvent("onAfterLinkAdd", criticalPathHandler);
			gantt.attachEvent("onAfterLinkUpdate", criticalPathHandler);
			gantt.attachEvent("onAfterLinkDelete", criticalPathHandler);
			gantt.attachEvent("onAfterTaskAdd", criticalPathHandler);
			gantt.attachEvent("onTaskIdChange", function (oldId, newId) {
				if (gantt.config.highlight_critical_path && gantt.isTaskExists(newId)) {
					gantt.refreshTask(newId);
				}
				return true;
			});
			gantt.attachEvent("onAfterTaskUpdate", criticalPathHandler);
			gantt.attachEvent("onAfterTaskDelete", criticalPathHandler);
		}
	};
};

/***/ }),

/***/ "./sources/ext/critical_path/slack.js":
/*!********************************************!*\
  !*** ./sources/ext/critical_path/slack.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var linksBuilder = __webpack_require__(/*! ../../core/relations/links_builder */ "./sources/core/relations/links_builder.js")(gantt);
var helpers = __webpack_require__(/*! ../../utils/helpers */ "./sources/utils/helpers.js");

module.exports = function(gantt) {
	var _private = {
		_freeSlack: {},
		_totalSlack: {},
		_slackNeedCalculate: true,
		_linkedTasksById: {},
		_calculateTotalSlack: function() {
			var linksByTaskId = this._linkedTasksById;

			helpers.forEach(linksBuilder.getLinkedTasks(), function(entry) {
				var task = gantt.getTask(entry.target);
				var slack = gantt.getFreeSlack(task);

				if (!linksByTaskId[entry.source]) {
					linksByTaskId[entry.source] = {
						minSlack: {
							target: entry.target,
							slack: slack
						},
						linked: []
					};
				} else {
					if (slack < linksByTaskId[entry.source].minSlack.slack) {
						linksByTaskId[entry.source].minSlack = {
							target: entry.target,
							slack: slack
						};
					}
				}
				linksByTaskId[entry.source].linked.push({
					target: entry.target,
					slack: slack
				});
			});

			var totalSlackByTaskId = {};

			gantt.eachTask(function(entry) {
				if (gantt.isSummaryTask(entry)) {
					return;
				}

				if (totalSlackByTaskId[entry.id] === undefined) {
					totalSlackByTaskId[entry.id] = 0;
				}
				totalSlackByTaskId[entry.id] += _private._chainSlackCount(entry);
			});

			gantt._slacksChanged = false;
			this._slackNeedCalculate = false;
			this._totalSlack = totalSlackByTaskId;

			return totalSlackByTaskId;
		},
		_chainSlackCount: function(entry, additional) {
			additional = additional || 0;
			switch (true) {
			case (!this._linkedTasksById[entry.id]):
				return gantt.calculateDuration(entry.end_date, gantt.getSubtaskDates().end_date) + additional;
			case (this._linkedTasksById[entry.id].linked.length === 1):
				return this._chainSlackCount(gantt.getTask(this._linkedTasksById[entry.id].linked[0].target), gantt.getFreeSlack(entry)) + additional;
			case (this._linkedTasksById[entry.id].linked.length > 1):
				var targetWithMinimalSlack = this._getTargetWithMinimalSlack(this._linkedTasksById[entry.id].linked);

				return this._chainSlackCount(gantt.getTask(targetWithMinimalSlack.target), gantt.getFreeSlack(entry)) + additional;
			}
		},

		_getTargetWithMinimalSlack: function(linked) {
			var result;
			helpers.forEach(linked, function(entry) {
				if (result === undefined || entry.slack < result.slack) {
					result = entry;
				}
			});
			return result;
		},

		_calculateTaskSlack: function(task) {
			var slack;

			if (task.$source && task.$source.length) {
				slack = this._calculateRelationSlack(task);
			} else {
				slack = this._calculateHierarchySlack(task);
			}

			return slack;
		},

		_calculateRelationSlack: function(task) {
			var minSlack = 0,
				slack,
				links = task.$source;

			for (var i = 0; i < links.length; i++) {
				slack = this._calculateLinkSlack(links[i]);
				if (minSlack > slack || i === 0) {
					minSlack = slack;
				}
			}
			return minSlack;
		},

		_calculateLinkSlack: function(linkId) {
			var link = gantt.getLink(linkId);
			var slack = 0;
			if (gantt.isTaskExists(link.source) && gantt.isTaskExists(link.target)) {
				slack = gantt.getSlack(gantt.getTask(link.source), gantt.getTask(link.target));
			}
			return slack;
		},

		_calculateHierarchySlack: function(task) {
			var slack = 0;
			var from;
			var to = gantt.getSubtaskDates().end_date;
			if (gantt.isTaskExists(task.parent)) {
				from = gantt.getSubtaskDates(task.id).end_date || task.end_date;
			} else {
				from = task.end_date;
			}
			slack = Math.max(gantt.calculateDuration(from, to), 0);
			return slack;
		},

		_resetTotalSlackCache: function() {
			this._slackNeedCalculate = true;
		},

		_shouldCalculateTotalSlack: function() {
			return this._slackNeedCalculate;
		},

		getFreeSlack: function(task) {
			if (!gantt.isTaskExists(task.id)) {
				return 0;
			}
			if (!this._freeSlack[task.id]) {
				if (gantt.isSummaryTask(task)) {
					this._freeSlack[task.id] = undefined;
				} else {
					this._freeSlack[task.id] =  this._calculateTaskSlack(task);
				}
			}
			return this._freeSlack[task.id];
		},

		getTotalSlack: function(task) {
			if (this._shouldCalculateTotalSlack()) {
				this._calculateTotalSlack();
			}
			if (task === undefined) {
				return this._totalSlack;
			}
			if (task.id !== undefined) {
				return this._totalSlack[task.id];
			}
			return this._totalSlack[task] || 0;
		},

		dropCachedFreeSlack: function() {
			this._linkedTasksById = {};
			this._freeSlack =  {};
			this._resetTotalSlackCache();
		},

		init: function(){
			function slackHandler(){
				_private.dropCachedFreeSlack();
			}

			gantt.attachEvent("onAfterLinkAdd", slackHandler);
			gantt.attachEvent("onTaskIdChange", slackHandler);
			gantt.attachEvent("onAfterLinkUpdate", slackHandler);
			gantt.attachEvent("onAfterLinkDelete", slackHandler);
			gantt.attachEvent("onAfterTaskAdd", slackHandler);
			gantt.attachEvent("onAfterTaskUpdate", slackHandler);
			gantt.attachEvent("onAfterTaskDelete", slackHandler);
			gantt.attachEvent("onRowDragEnd", slackHandler);
			gantt.attachEvent("onAfterTaskMove", slackHandler);
		}
	};

	return _private;
};

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