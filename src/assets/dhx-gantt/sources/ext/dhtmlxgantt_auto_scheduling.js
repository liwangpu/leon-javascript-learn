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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/auto_scheduling.js");
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

/***/ "./sources/ext/auto_scheduling.js":
/*!****************************************!*\
  !*** ./sources/ext/auto_scheduling.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../core/relations/links_common */ "./sources/core/relations/links_common.js")(gantt);

var linksBuilder = __webpack_require__(/*! ../core/relations/links_builder */ "./sources/core/relations/links_builder.js")(gantt);
var graphHelper = __webpack_require__(/*! ../core/relations/graph_helper */ "./sources/core/relations/graph_helper.js")(gantt);
var ConstraintTypes = __webpack_require__(/*! ./auto_scheduling/constraint_types */ "./sources/ext/auto_scheduling/constraint_types.ts").ConstraintTypes;

var constraintsHelper = __webpack_require__(/*! ./auto_scheduling/constraints */ "./sources/ext/auto_scheduling/constraints.ts").ConstraintsHelper.Create(
	gantt
);
var AutoSchedulingPlanner = __webpack_require__(/*! ./auto_scheduling/planner */ "./sources/ext/auto_scheduling/planner.ts")
	.AutoSchedulingPlanner;

var planner = new AutoSchedulingPlanner(gantt, graphHelper, constraintsHelper);

var ConnectedGroupsHelper = __webpack_require__(/*! ./auto_scheduling/connected_groups */ "./sources/ext/auto_scheduling/connected_groups.ts")
	.ConnectedGroupsHelper;
var connectedGroups = new ConnectedGroupsHelper(gantt, linksBuilder);

var LoopsFinder = __webpack_require__(/*! ./auto_scheduling/loops_finder */ "./sources/ext/auto_scheduling/loops_finder.ts").LoopsFinder;

var loopsFinder = new LoopsFinder(
	gantt,
	graphHelper,
	linksBuilder
);

gantt.getConnectedGroup = connectedGroups.getConnectedGroup;
gantt.getConstraintType = constraintsHelper.getConstraintType;
gantt.getConstraintLimitations = function (task) {
	var plan = constraintsHelper.processConstraint(task, null);
	return {
		earliestStart: plan.earliestStart || null,
		earliestEnd: plan.earliestEnd || null,
		latestStart: plan.latestStart || null,
		latestEnd: plan.latestEnd || null
	};
};

gantt.isCircularLink = loopsFinder.isCircularLink;
gantt.findCycles = loopsFinder.findCycles;

gantt.config.constraint_types = ConstraintTypes;
gantt.config.auto_scheduling = false;
gantt.config.auto_scheduling_descendant_links = false;
gantt.config.auto_scheduling_initial = true;
gantt.config.auto_scheduling_strict = false;
gantt.config.auto_scheduling_move_projects = true;
gantt.config.project_start = null;
gantt.config.project_end = null;
gantt.config.schedule_from_end = false;

function preferInitialTaskDates(startTask, relations) {
	// TODO: remove in 7.0
	if (!gantt.config.auto_scheduling_compatibility) {
		return;
	}

	// .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
	// will be removed in future versions
	for (var i = 0; i < relations.length; i++) {
		var rel = relations[i];
		var task = gantt.getTask(rel.target);

		if (!gantt.config.auto_scheduling_strict || rel.target == startTask) {
			rel.preferredStart = new Date(task.start_date);
		}
	}
}

function updateParentsAndCallEvents(updatedTasks) {
	function resetTime(task) {
		if (batchUpdate)
			return;

		var start = task.start_date.valueOf(),
			end = task.end_date.valueOf();

		gantt.resetProjectDates(task);
		if (task.start_date.valueOf() != start || task.end_date.valueOf() != end) {
			batchUpdate = true;
			return;
		}
		var children = gantt.getChildren(task.id);
		for (var i = 0; !batchUpdate && i < children.length; i++) {
			resetTime(gantt.getTask(children[i]));
		}
	}

	var batchUpdate = false;
	// call batchUpdate (full repaint) only if we update multiple tasks,
	if (updatedTasks.length == 1) {
		gantt.eachParent(resetTime, updatedTasks[0]);
	} else if (updatedTasks.length) {
		batchUpdate = true;
	}

	function payload() {
		for (var i = 0; i < updatedTasks.length; i++) {
			gantt.updateTask(updatedTasks[i]);
		}
	}
	if (batchUpdate) {
		gantt.batchUpdate(payload);
	} else {
		payload();
	}
}

gantt._autoSchedule = function (id, relations) {
	if (gantt.callEvent("onBeforeAutoSchedule", [id]) === false) {
		return;
	}
	gantt._autoscheduling_in_progress = true;

	var constraints = constraintsHelper.getConstraints(
		id,
		gantt.isTaskExists(id) ? relations : null
	);

	var updatedTasks = [];

	var cycles = graphHelper.findLoops(relations);
	if (cycles.length) {
		gantt.callEvent("onAutoScheduleCircularLink", [cycles]);
	} else {
		preferInitialTaskDates(id, relations);

		var plan = planner.generatePlan(relations, constraints);
		updatedTasks = planner.applyProjectPlan(plan);

		updateParentsAndCallEvents(updatedTasks);
	}

	gantt._autoscheduling_in_progress = false;
	gantt.callEvent("onAfterAutoSchedule", [id, updatedTasks]);
};

gantt.autoSchedule = function (id, inclusive) {
	if (inclusive === undefined) {
		inclusive = true;
	} else {
		inclusive = !!inclusive;
	}

	var relations;
	if (id !== undefined) {
		if (gantt.config.auto_scheduling_compatible) {
			linksBuilder.getLinkedTasks(id, inclusive);
		} else {
			relations = connectedGroups.getConnectedGroupRelations(id);
		}
	} else {
		relations = linksBuilder.getLinkedTasks();
	}

	gantt._autoSchedule(id, relations);
};

gantt.attachEvent("onTaskLoading", function (task) {
	if (task.constraint_date && typeof task.constraint_date === "string") {
		task.constraint_date = gantt.date.parseDate(task.constraint_date, "parse_date");
	}
	task.constraint_type = gantt.getConstraintType(task);
	return true;
});
gantt.attachEvent("onTaskCreated", function (task) {
	task.constraint_type = gantt.getConstraintType(task);
	return true;
});

var attachUIHandlers = __webpack_require__(/*! ./auto_scheduling/ui_handlers */ "./sources/ext/auto_scheduling/ui_handlers.ts").attachUIHandlers;
attachUIHandlers(gantt, linksBuilder, loopsFinder, connectedGroups);


/***/ }),

/***/ "./sources/ext/auto_scheduling/alap_strategy.ts":
/*!******************************************************!*\
  !*** ./sources/ext/auto_scheduling/alap_strategy.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var task_plan_1 = __webpack_require__(/*! ./task_plan */ "./sources/ext/auto_scheduling/task_plan.ts");
var AlapStrategy = /** @class */ (function () {
    function AlapStrategy() {
    }
    AlapStrategy.Create = function (gantt) {
        var instance = new AlapStrategy();
        instance._gantt = gantt;
        return instance;
    };
    AlapStrategy.prototype.resolveRelationDate = function (taskId, adjacentLinks, plansHash) {
        var maxEnd = null;
        var linkId = null;
        var maxStart = null;
        var defaultStart = null;
        var task = this._gantt.getTask(taskId);
        var relations = adjacentLinks.successors;
        var maxRelationDate = null;
        var masterPlan = plansHash[taskId];
        for (var i = 0; i < relations.length; i++) {
            var relation = relations[i];
            // .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
            // will be removed in future versions
            // TODO: remove .preferredStart in v7.0
            defaultStart = relation.preferredStart;
            var constraintDate = this.getLatestEndDate(relation, plansHash, task);
            var constraintStartDate = this._gantt.calculateEndDate({ start_date: constraintDate, duration: -task.duration, task: task });
            if (this.isGreaterOrDefault(maxRelationDate, constraintDate, task)) {
                maxRelationDate = constraintDate;
            }
            if (this.isGreaterOrDefault(defaultStart, constraintStartDate, task) && this.isGreaterOrDefault(maxEnd, constraintDate, task)) {
                maxEnd = constraintDate;
                maxStart = constraintStartDate;
                linkId = relation.id;
            }
        }
        if (!relations.length && this._gantt.config.project_end) {
            if (this.isGreaterOrDefault(this._gantt.config.project_end, task.end_date, task)) {
                maxEnd = this._gantt.config.project_end;
            }
        }
        if (maxEnd) {
            maxEnd = this._gantt.getClosestWorkTime({ date: maxEnd, dir: "future", task: task });
            maxStart = this._gantt.calculateEndDate({ start_date: maxEnd, duration: -task.duration, task: task });
        }
        var currentPlan = task_plan_1.TaskPlan.Create(masterPlan);
        currentPlan.link = linkId;
        currentPlan.task = taskId;
        currentPlan.end_date = maxEnd;
        currentPlan.start_date = maxStart;
        currentPlan.kind = "alap";
        if (maxRelationDate) {
            currentPlan.latestSchedulingStart = this._gantt.calculateEndDate({ start_date: maxRelationDate, duration: -task.duration, task: task });
            currentPlan.latestSchedulingEnd = maxRelationDate;
        }
        return currentPlan;
    };
    AlapStrategy.prototype.isFirstSmaller = function (small, big, task) {
        if (small.valueOf() < big.valueOf() && this._gantt._hasDuration(small, big, task)) {
            return true;
        }
        return false;
    };
    AlapStrategy.prototype.isGreaterOrDefault = function (smallDate, bigDate, task) {
        return !!(!smallDate || this.isFirstSmaller(bigDate, smallDate, task));
    };
    AlapStrategy.prototype.getSuccessorStartDate = function (id, plansHash) {
        var plan = plansHash[id];
        var task = this._gantt.getTask(id);
        var res;
        if (!(plan && (plan.start_date || plan.end_date))) {
            res = task.start_date;
        }
        else if (plan.start_date) {
            res = plan.start_date;
        }
        else {
            res = this._gantt.calculateEndDate({ start_date: plan.end_date, duration: -task.duration, task: task });
        }
        return res;
    };
    AlapStrategy.prototype.getLatestEndDate = function (relation, plansHash, task) {
        var successorStart = this.getSuccessorStartDate(relation.target, plansHash);
        var predecessor = task;
        var predecessorEnd = this._gantt.getClosestWorkTime({ date: successorStart, dir: "past", task: predecessor });
        if (predecessorEnd && relation.lag && relation.lag * 1 === relation.lag * 1) {
            predecessorEnd = this._gantt.calculateEndDate({ start_date: predecessorEnd, duration: -relation.lag * 1, task: predecessor });
        }
        return predecessorEnd;
    };
    return AlapStrategy;
}());
exports.AlapStrategy = AlapStrategy;


/***/ }),

/***/ "./sources/ext/auto_scheduling/asap_strategy.ts":
/*!******************************************************!*\
  !*** ./sources/ext/auto_scheduling/asap_strategy.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var task_plan_1 = __webpack_require__(/*! ./task_plan */ "./sources/ext/auto_scheduling/task_plan.ts");
var AsapStrategy = /** @class */ (function () {
    function AsapStrategy() {
    }
    AsapStrategy.Create = function (gantt) {
        var instance = new AsapStrategy();
        instance._gantt = gantt;
        return instance;
    };
    AsapStrategy.prototype.resolveRelationDate = function (taskId, adjacentLinks, plansHash) {
        var minStart = null;
        var linkId = null;
        var defaultStart = null;
        var task = this._gantt.getTask(taskId);
        var relations = adjacentLinks.predecessors;
        var minRelationDate = null;
        for (var i = 0; i < relations.length; i++) {
            var relation = relations[i];
            // .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
            // will be removed in future versions
            // TODO: remove .preferredStart in v7.0
            defaultStart = relation.preferredStart;
            var constraintDate = this.getEarliestStartDate(relation, plansHash, task);
            if (this.isSmallerOrDefault(minRelationDate, constraintDate, task)) {
                minRelationDate = constraintDate;
            }
            if (this.isSmallerOrDefault(defaultStart, constraintDate, task) &&
                this.isSmallerOrDefault(minStart, constraintDate, task)) {
                minStart = constraintDate;
                linkId = relation.id;
            }
        }
        if (!relations.length && this._gantt.config.project_start) {
            if (this.isSmallerOrDefault(task.start_date, this._gantt.config.project_start, task)) {
                minStart = this._gantt.config.project_start;
            }
        }
        var maxEnd = null;
        if (minStart) {
            minStart = this._gantt.getClosestWorkTime({
                date: minStart,
                dir: "future",
                task: task
            });
            maxEnd = this._gantt.calculateEndDate({
                start_date: minStart,
                duration: task.duration,
                task: task
            });
        }
        var masterPlan = plansHash[taskId];
        var currentPlan = task_plan_1.TaskPlan.Create(masterPlan);
        currentPlan.link = linkId;
        currentPlan.task = taskId;
        currentPlan.start_date = minStart;
        currentPlan.end_date = maxEnd;
        currentPlan.kind = "asap";
        if (minRelationDate) {
            currentPlan.earliestSchedulingStart = minRelationDate;
            currentPlan.earliestSchedulingEnd = this._gantt.calculateEndDate({
                start_date: minRelationDate,
                duration: task.duration,
                task: task
            });
        }
        return currentPlan;
    };
    AsapStrategy.prototype.isEqual = function (dateA, dateB, task) {
        return !this._gantt._hasDuration(dateA, dateB, task);
    };
    AsapStrategy.prototype.isFirstSmaller = function (small, big, task) {
        if (small.valueOf() < big.valueOf() && !this.isEqual(small, big, task)) {
            return true;
        }
        return false;
    };
    AsapStrategy.prototype.isSmallerOrDefault = function (smallDate, bigDate, task) {
        return !!(!smallDate || this.isFirstSmaller(smallDate, bigDate, task));
    };
    AsapStrategy.prototype.getPredecessorEndDate = function (id, plansHash) {
        var plan = plansHash[id];
        var task = this._gantt.getTask(id);
        var res;
        if (!(plan && (plan.start_date || plan.end_date))) {
            res = task.end_date;
        }
        else if (plan.end_date) {
            res = plan.end_date;
        }
        else {
            res = this._gantt.calculateEndDate({
                start_date: plan.start_date,
                duration: task.duration,
                task: task
            });
        }
        return res;
    };
    AsapStrategy.prototype.getEarliestStartDate = function (relation, plansHash, task) {
        var predecessorEnd = this.getPredecessorEndDate(relation.source, plansHash);
        var successor = task;
        var successorStart = this._gantt.getClosestWorkTime({
            date: predecessorEnd,
            dir: "future",
            task: successor
        });
        if (predecessorEnd &&
            relation.lag &&
            relation.lag * 1 === relation.lag * 1) {
            successorStart = this._gantt.calculateEndDate({
                start_date: predecessorEnd,
                duration: relation.lag * 1,
                task: successor
            });
        }
        return successorStart;
    };
    return AsapStrategy;
}());
exports.AsapStrategy = AsapStrategy;


/***/ }),

/***/ "./sources/ext/auto_scheduling/connected_groups.ts":
/*!*********************************************************!*\
  !*** ./sources/ext/auto_scheduling/connected_groups.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function findGroups(links) {
    var visited = {};
    var groups = [];
    var source;
    var target;
    var root;
    // main loop - find any unvisited vertex from the input array and
    // treat it as the source, then perform a breadth first search from
    // it. All vertices visited from this search belong to the same group
    for (var i = 0; i < links.length; i++) {
        source = links[i].source;
        target = links[i].target;
        root = null;
        if (!visited[source]) {
            root = source;
        }
        else if (!visited[target]) {
            root = target;
        }
        if (root) {
            // there is an unvisited vertex in this pair.
            // perform a breadth first search, and push the resulting
            // group onto the list of all groups
            var length_1 = links.length;
            groups.push(breadthFirstSearch(root, links, visited));
            if (length_1 !== links.length) {
                i = -1;
            }
        }
    }
    return groups;
}
// Breadth First Search function
// v is the source vertex
// links is the input array, which contains all gantt relations
// visited is a dictionary for keeping track of whether a node is visited
function breadthFirstSearch(v, links, visited) {
    var queue = [v];
    var groupTasks = [];
    var groupLinksInternal = {};
    var groupLinksPublic = {};
    var currentVertex;
    while (queue.length > 0) {
        currentVertex = queue.shift();
        if (!visited[currentVertex]) {
            visited[currentVertex] = true;
            groupTasks.push(currentVertex);
            // go through the input array to find vertices that are
            // directly adjacent to the current vertex, and put them
            // onto the queue
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                // tslint:disable-next-line triple-equals
                if ((link.source == currentVertex || link.sourceParent == currentVertex)) {
                    if (!visited[link.target]) {
                        queue.push(link.target);
                        groupLinksPublic[link.id] = true;
                        links.splice(i, 1);
                        i--;
                    }
                    groupLinksInternal[link.hashSum] = link;
                    // tslint:disable-next-line triple-equals
                }
                else if ((link.target == currentVertex || link.targetParent == currentVertex)) {
                    if (!visited[link.source]) {
                        queue.push(link.source);
                        groupLinksPublic[link.id] = true;
                        links.splice(i, 1);
                        i--;
                    }
                    groupLinksInternal[link.hashSum] = link;
                }
            }
        }
    }
    var linksArray = [];
    var linksObjects = [];
    for (var i in groupLinksPublic) {
        linksArray.push(i);
    }
    for (var i in groupLinksInternal) {
        linksObjects.push(groupLinksInternal[i]);
    }
    // return everything in the current "group"
    return { tasks: groupTasks, links: linksArray, processedLinks: linksObjects };
}
var ConnectedGroupsHelper = /** @class */ (function () {
    function ConnectedGroupsHelper(gantt, linksBuilder) {
        var _this = this;
        this.getConnectedGroupRelations = function (id) {
            var links = _this._linksBuilder.getLinkedTasks();
            var group = breadthFirstSearch(id, links, {});
            return group.processedLinks;
        };
        this.getConnectedGroup = function (id) {
            var links = _this._linksBuilder.getLinkedTasks();
            if (id !== undefined) {
                if (_this._gantt.getTask(id).type === _this._gantt.config.types.project) {
                    return { tasks: [], links: [] };
                }
                var group = breadthFirstSearch(id, links, {});
                return {
                    tasks: group.tasks,
                    links: group.links
                };
            }
            else {
                return findGroups(links).map(function (group) { return ({ tasks: group.tasks, links: group.links }); });
            }
        };
        this._linksBuilder = linksBuilder;
        this._gantt = gantt;
    }
    return ConnectedGroupsHelper;
}());
exports.ConnectedGroupsHelper = ConnectedGroupsHelper;


/***/ }),

/***/ "./sources/ext/auto_scheduling/constraint_types.ts":
/*!*********************************************************!*\
  !*** ./sources/ext/auto_scheduling/constraint_types.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConstraintTypes;
(function (ConstraintTypes) {
    // As Soon As Possible (ASAP)
    ConstraintTypes["ASAP"] = "asap";
    // As Late As Possible (ALAP)
    ConstraintTypes["ALAP"] = "alap";
    // Start No Earlier Than (SNET)
    ConstraintTypes["SNET"] = "snet";
    // Start No Later Than (SNLT)
    ConstraintTypes["SNLT"] = "snlt";
    // Finish No Earlier Than (FNET)
    ConstraintTypes["FNET"] = "fnet";
    // Finish No Later Than (FNLT)
    ConstraintTypes["FNLT"] = "fnlt";
    // Must Start On (MSO)
    ConstraintTypes["MSO"] = "mso";
    // Must Finish On (MFO)
    ConstraintTypes["MFO"] = "mfo";
})(ConstraintTypes = exports.ConstraintTypes || (exports.ConstraintTypes = {}));


/***/ }),

/***/ "./sources/ext/auto_scheduling/constraints.ts":
/*!****************************************************!*\
  !*** ./sources/ext/auto_scheduling/constraints.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var constraint_types_1 = __webpack_require__(/*! ./constraint_types */ "./sources/ext/auto_scheduling/constraint_types.ts");
var task_plan_1 = __webpack_require__(/*! ./task_plan */ "./sources/ext/auto_scheduling/task_plan.ts");
var ConstraintsHelper = /** @class */ (function () {
    function ConstraintsHelper(gantt) {
        var _this = this;
        this.isAsapTask = function (task) {
            var constraintType = _this.getConstraintType(task);
            if (_this._gantt.config.schedule_from_end) {
                if (constraintType === constraint_types_1.ConstraintTypes.ASAP) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (constraintType === constraint_types_1.ConstraintTypes.ALAP) {
                    return false;
                }
                else {
                    return true;
                }
            }
        };
        this.isAlapTask = function (task) {
            return !_this.isAsapTask(task);
        };
        this.getConstraintType = function (task) {
            // in case of backward scheduling, tasks without explicit constraints are considered ALAP tasks
            if (task.constraint_type) {
                return task.constraint_type;
            }
            else if (_this._gantt.config.schedule_from_end) {
                return constraint_types_1.ConstraintTypes.ALAP;
            }
            else {
                return constraint_types_1.ConstraintTypes.ASAP;
            }
        };
        this.hasConstraint = function (task) {
            return !!_this.getConstraintType(task);
        };
        this.processConstraint = function (task, plan) {
            if (_this.hasConstraint(task)) {
                if (task.constraint_type === constraint_types_1.ConstraintTypes.ALAP ||
                    task.constraint_type === constraint_types_1.ConstraintTypes.ASAP) {
                    // this kind of constraint is calculated after main scheduling
                }
                else {
                    var constraintDate = task.constraint_date;
                    var newPlan = task_plan_1.TaskPlan.Create(plan);
                    newPlan.task = task.id;
                    switch (task.constraint_type) {
                        case constraint_types_1.ConstraintTypes.SNET:
                            newPlan.earliestStart = new Date(constraintDate);
                            newPlan.earliestEnd = _this._gantt.calculateEndDate({
                                start_date: newPlan.earliestStart,
                                duration: task.duration,
                                task: task
                            });
                            newPlan.link = null;
                            break;
                        case constraint_types_1.ConstraintTypes.SNLT:
                            newPlan.latestStart = new Date(constraintDate);
                            newPlan.latestEnd = _this._gantt.calculateEndDate({
                                start_date: newPlan.latestStart,
                                duration: task.duration,
                                task: task
                            });
                            newPlan.link = null;
                            break;
                        case constraint_types_1.ConstraintTypes.FNET:
                            newPlan.earliestStart = _this._gantt.calculateEndDate({
                                start_date: constraintDate,
                                duration: -task.duration,
                                task: task
                            });
                            newPlan.earliestEnd = new Date(constraintDate);
                            newPlan.link = null;
                            break;
                        case constraint_types_1.ConstraintTypes.FNLT:
                            newPlan.latestStart = _this._gantt.calculateEndDate({
                                start_date: constraintDate,
                                duration: -task.duration,
                                task: task
                            });
                            newPlan.latestEnd = new Date(constraintDate);
                            newPlan.link = null;
                            break;
                        case constraint_types_1.ConstraintTypes.MSO:
                            newPlan.earliestStart = new Date(constraintDate);
                            newPlan.earliestEnd = _this._gantt.calculateEndDate({
                                start_date: newPlan.earliestStart,
                                duration: task.duration,
                                task: task
                            });
                            newPlan.latestStart = newPlan.earliestStart;
                            newPlan.latestEnd = newPlan.earliestEnd;
                            newPlan.link = null;
                            break;
                        case constraint_types_1.ConstraintTypes.MFO:
                            newPlan.earliestStart = _this._gantt.calculateEndDate({
                                start_date: constraintDate,
                                duration: -task.duration,
                                task: task
                            });
                            newPlan.earliestEnd = _this._gantt.calculateEndDate({
                                start_date: newPlan.earliestStart,
                                duration: task.duration,
                                task: task
                            });
                            newPlan.latestStart = newPlan.earliestStart;
                            newPlan.latestEnd = newPlan.earliestEnd;
                            newPlan.link = null;
                            break;
                    }
                    return newPlan;
                }
            }
            return plan;
        };
        this.getConstraints = function (id, relations) {
            var result = [];
            var tasks = {};
            var store = function (task) {
                if (tasks[task.id]) {
                    return;
                }
                if (_this.hasConstraint(task) && !_this._gantt.isSummaryTask(task)) {
                    tasks[task.id] = task;
                }
            };
            if (_this._gantt.isTaskExists(id)) {
                var task = _this._gantt.getTask(id);
                store(task);
            }
            _this._gantt.eachTask(function (task) { return store(task); }, id);
            var current;
            if (relations) {
                for (var i = 0; i < relations.length; i++) {
                    var rel = relations[i];
                    if (!tasks[rel.target]) {
                        current = _this._gantt.getTask(rel.target);
                        store(current);
                    }
                    if (!tasks[rel.source]) {
                        current = _this._gantt.getTask(rel.source);
                        store(current);
                    }
                }
            }
            for (var taskId in tasks) {
                result.push(tasks[taskId]);
            }
            return result;
        };
        this._gantt = gantt;
    }
    ConstraintsHelper.Create = function (gantt) {
        return new ConstraintsHelper(gantt);
    };
    return ConstraintsHelper;
}());
exports.ConstraintsHelper = ConstraintsHelper;


/***/ }),

/***/ "./sources/ext/auto_scheduling/loops_finder.ts":
/*!*****************************************************!*\
  !*** ./sources/ext/auto_scheduling/loops_finder.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LoopsFinder = /** @class */ (function () {
    function LoopsFinder(gantt, graphHelper, linksBuilder) {
        var _this = this;
        this.isCircularLink = function (link) {
            return !!_this.getLoopContainingLink(link);
        };
        this.getLoopContainingLink = function (link) {
            var graphHelper = _this._graphHelper;
            var linksBuilder = _this._linksBuilder;
            var gantt = _this._gantt;
            var allRelations = linksBuilder.getLinkedTasks();
            if (!gantt.isLinkExists(link.id)) {
                allRelations = allRelations.concat(gantt._formatLink(link));
            }
            var cycles = graphHelper.findLoops(allRelations);
            var found = false;
            for (var i = 0; i < cycles.length && !found; i++) {
                var links = cycles[i].links;
                for (var j = 0; j < links.length; j++) {
                    // tslint:disable-next-line triple-equals
                    if (links[j] == link.id) {
                        return cycles[i];
                    }
                }
            }
            return null;
        };
        this.findCycles = function () {
            var graphHelper = _this._graphHelper;
            var linksBuilder = _this._linksBuilder;
            var allRelations = linksBuilder.getLinkedTasks();
            return graphHelper.findLoops(allRelations);
        };
        this._linksBuilder = linksBuilder;
        this._graphHelper = graphHelper;
        this._gantt = gantt;
    }
    return LoopsFinder;
}());
exports.LoopsFinder = LoopsFinder;


/***/ }),

/***/ "./sources/ext/auto_scheduling/planner.ts":
/*!************************************************!*\
  !*** ./sources/ext/auto_scheduling/planner.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alap_strategy_1 = __webpack_require__(/*! ./alap_strategy */ "./sources/ext/auto_scheduling/alap_strategy.ts");
var asap_strategy_1 = __webpack_require__(/*! ./asap_strategy */ "./sources/ext/auto_scheduling/asap_strategy.ts");
var constraint_types_1 = __webpack_require__(/*! ./constraint_types */ "./sources/ext/auto_scheduling/constraint_types.ts");
var task_plan_1 = __webpack_require__(/*! ./task_plan */ "./sources/ext/auto_scheduling/task_plan.ts");
var AutoSchedulingPlanner = /** @class */ (function () {
    function AutoSchedulingPlanner(gantt, graphHelper, constraintsHelper) {
        this._gantt = gantt;
        this._constraintsHelper = constraintsHelper;
        this._graphHelper = graphHelper;
        this._asapStrategy = asap_strategy_1.AsapStrategy.Create(gantt);
        this._alapStrategy = alap_strategy_1.AlapStrategy.Create(gantt);
    }
    AutoSchedulingPlanner.prototype.generatePlan = function (relations, constraints) {
        var graphHelper = this._graphHelper;
        var gantt = this._gantt;
        var constraintsHelper = this._constraintsHelper;
        var alapStrategy = this._alapStrategy;
        var asapStrategy = this._asapStrategy;
        var _a = this.buildWorkCollections(relations, constraints, graphHelper), orderedIds = _a.orderedIds, reversedIds = _a.reversedIds, relationsMap = _a.relationsMap, plansHash = _a.plansHash;
        var result;
        this.processConstraints(orderedIds, plansHash, gantt, constraintsHelper);
        if (gantt.config.schedule_from_end) {
            // when scheduling from end - iterate tasks from end and schedule them as late as possible
            // after that - iterate tasks from start and schedule asap tasks
            result = this.iterateTasks(reversedIds, orderedIds, constraintsHelper.isAlapTask, alapStrategy, asapStrategy, relationsMap, plansHash);
        }
        else {
            // when scheduling from end - iterate tasks from start and schedule them as soon as possible
            // after that - iterate tasks from end and schedule asap alap
            result = this.iterateTasks(orderedIds, reversedIds, constraintsHelper.isAsapTask, asapStrategy, alapStrategy, relationsMap, plansHash);
        }
        return result;
    };
    AutoSchedulingPlanner.prototype.applyProjectPlan = function (projectPlan) {
        var gantt = this._gantt;
        var plan;
        var task;
        var link;
        var reason;
        var updateTasks = [];
        for (var i = 0; i < projectPlan.length; i++) {
            link = null;
            reason = null;
            plan = projectPlan[i];
            if (!plan.task) {
                continue;
            }
            task = gantt.getTask(plan.task);
            if (plan.link) {
                link = gantt.getLink(plan.link);
                if (plan.kind === "asap") {
                    reason = this._gantt.getTask(link.source);
                }
                else {
                    // alap tasks are scheduled by their successors
                    reason = this._gantt.getTask(link.target);
                }
            }
            var newDate = null;
            if (plan.start_date &&
                task.start_date.valueOf() !== plan.start_date.valueOf()) {
                newDate = plan.start_date;
            }
            if (!newDate) {
                continue;
            }
            task.start_date = newDate;
            task.end_date = gantt.calculateEndDate(task);
            updateTasks.push(task.id);
            gantt.callEvent("onAfterTaskAutoSchedule", [
                task,
                newDate,
                link,
                reason
            ]);
        }
        return updateTasks;
    };
    AutoSchedulingPlanner.prototype.iterateTasks = function (mainSequence, secondarySequence, isMainSequence, mainSequenceStrategy, secondarySequenceStrategy, relationsMap, plansHash) {
        var gantt = this._gantt;
        var result = [];
        for (var i = 0; i < mainSequence.length; i++) {
            var currentId = mainSequence[i];
            var task = gantt.getTask(currentId);
            var plan = mainSequenceStrategy.resolveRelationDate(currentId, relationsMap[currentId], plansHash);
            this.limitPlanDates(task, plan);
            if (isMainSequence(task)) {
                this.processResolvedDate(task, plan, result, plansHash);
            }
            else {
                plansHash[task.id] = plan;
            }
        }
        for (var i = 0; i < secondarySequence.length; i++) {
            var currentId = secondarySequence[i];
            var task = gantt.getTask(currentId);
            if (!isMainSequence(task)) {
                var plan = secondarySequenceStrategy.resolveRelationDate(currentId, relationsMap[currentId], plansHash);
                this.limitPlanDates(task, plan);
                this.processResolvedDate(task, plan, result, plansHash);
            }
        }
        return result;
    };
    AutoSchedulingPlanner.prototype.processResolvedDate = function (task, plan, result, plansHash) {
        if (plan.start_date && this._gantt.isLinkExists(plan.link)) {
            var link = null;
            var reason = null;
            if (plan.link) {
                link = this._gantt.getLink(plan.link);
                if (plan.kind === "asap") {
                    reason = this._gantt.getTask(link.source);
                }
                else {
                    // alap tasks are scheduled by their successors
                    reason = this._gantt.getTask(link.target);
                }
            }
            if (task.start_date.valueOf() !== plan.start_date.valueOf() &&
                this._gantt.callEvent("onBeforeTaskAutoSchedule", [
                    task,
                    plan.start_date,
                    link,
                    reason
                ]) === false) {
                return;
            }
        }
        plansHash[task.id] = plan;
        if (plan.start_date) {
            result.push(plan);
        }
    };
    AutoSchedulingPlanner.prototype.limitPlanDates = function (task, plan) {
        var effectiveStart = plan.start_date || task.start_date;
        if (plan.earliestStart) {
            if (effectiveStart < plan.earliestStart) {
                plan.start_date = plan.earliestStart;
                plan.end_date = plan.earliestEnd;
            }
        }
        if (plan.latestStart) {
            if (effectiveStart > plan.latestStart) {
                plan.start_date = plan.latestStart;
                plan.end_date = plan.latestEnd;
            }
        }
        if (plan.latestSchedulingStart && effectiveStart > plan.latestSchedulingStart) {
            plan.start_date = plan.latestSchedulingStart;
            plan.end_date = plan.latestSchedulingEnd;
        }
        if (plan.earliestSchedulingStart && effectiveStart < plan.earliestSchedulingStart) {
            plan.start_date = plan.earliestSchedulingStart;
            plan.end_date = plan.earliestSchedulingEnd;
        }
        if (plan.start_date) { // start/end dates are either both defined or both not
            if (plan.start_date > plan.latestSchedulingStart ||
                plan.start_date < plan.earliestSchedulingStart ||
                plan.start_date > plan.latestStart ||
                plan.start_date < plan.earliestStart ||
                plan.end_date > plan.latestSchedulingEnd ||
                plan.end_date < plan.earliestSchedulingEnd ||
                plan.end_date > plan.latestEnd ||
                plan.end_date < plan.earliestEnd) {
                plan.conflict = true;
            }
        }
        return plan;
    };
    AutoSchedulingPlanner.prototype.buildWorkCollections = function (relations, constraints, graphHelper) {
        var gantt = this._gantt;
        var orderedIds = graphHelper.topologicalSort(relations);
        var reversedIds = orderedIds.slice().reverse();
        var plansHash = {};
        var relationsMap = {};
        for (var i = 0, len = orderedIds.length; i < len; i++) {
            var id = orderedIds[i];
            var task = gantt.getTask(id);
            if (task.auto_scheduling === false) {
                continue;
            }
            relationsMap[id] = {
                successors: [],
                predecessors: []
            };
            plansHash[id] = null;
        }
        for (var i = 0, len = constraints.length; i < len; i++) {
            var task = constraints[i];
            if (plansHash[task.id] === undefined) {
                reversedIds.unshift(task.id);
                orderedIds.unshift(task.id);
                plansHash[task.id] = null;
                relationsMap[task.id] = {
                    successors: [],
                    predecessors: []
                };
            }
        }
        for (var i = 0, len = relations.length; i < len; i++) {
            var rel = relations[i];
            if (relationsMap[rel.source]) {
                relationsMap[rel.source].successors.push(rel);
            }
            if (relationsMap[rel.target]) {
                relationsMap[rel.target].predecessors.push(rel);
            }
        }
        return {
            orderedIds: orderedIds,
            reversedIds: reversedIds,
            relationsMap: relationsMap,
            plansHash: plansHash
        };
    };
    AutoSchedulingPlanner.prototype.processConstraints = function (orderedIds, plansHash, gantt, constraintsHelper) {
        for (var i = 0; i < orderedIds.length; i++) {
            var currentId = orderedIds[i];
            var task = gantt.getTask(currentId);
            var constraintType = constraintsHelper.getConstraintType(task);
            if (constraintType &&
                constraintType !== constraint_types_1.ConstraintTypes.ASAP &&
                constraintType !== constraint_types_1.ConstraintTypes.ALAP) {
                var plan = constraintsHelper.processConstraint(task, task_plan_1.TaskPlan.Create());
                plansHash[task.id] = plan;
            }
        }
    };
    return AutoSchedulingPlanner;
}());
exports.AutoSchedulingPlanner = AutoSchedulingPlanner;


/***/ }),

/***/ "./sources/ext/auto_scheduling/task_plan.ts":
/*!**************************************************!*\
  !*** ./sources/ext/auto_scheduling/task_plan.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TaskPlan = /** @class */ (function () {
    function TaskPlan() {
        this.link = null;
        this.task = null;
        this.start_date = null;
        this.end_date = null;
        this.latestStart = null;
        this.earliestStart = null;
        this.earliestEnd = null;
        this.latestEnd = null;
        this.latestSchedulingStart = null;
        this.earliestSchedulingStart = null;
        this.latestSchedulingEnd = null;
        this.earliestSchedulingEnd = null;
        this.kind = "asap";
        this.conflict = false;
    }
    TaskPlan.Create = function (parent) {
        var plan = new TaskPlan();
        if (parent) {
            for (var i in plan) {
                if (parent[i] !== undefined) {
                    plan[i] = parent[i];
                }
            }
        }
        return plan;
    };
    return TaskPlan;
}());
exports.TaskPlan = TaskPlan;


/***/ }),

/***/ "./sources/ext/auto_scheduling/ui_handlers.ts":
/*!****************************************************!*\
  !*** ./sources/ext/auto_scheduling/ui_handlers.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function attachUIHandlers(gantt, linksBuilder, loopsFinder, connectedGroupsHelper) {
    var _attachAutoSchedulingHandlers = function () {
        function _autoScheduleAfterLinkChange(id, link) {
            if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
                gantt.autoSchedule(link.source);
            }
        }
        gantt.attachEvent("onAfterLinkUpdate", _autoScheduleAfterLinkChange);
        gantt.attachEvent("onAfterLinkAdd", _autoScheduleAfterLinkChange);
        gantt.attachEvent("onAfterLinkDelete", function (id, link) {
            if (gantt.config.auto_scheduling &&
                !gantt._autoscheduling_in_progress &&
                gantt.isTaskExists(link.target)) {
                // after link deleted - auto schedule target for other relations that may be left
                var target = gantt.getTask(link.target);
                var predecessors = gantt._getPredecessors(target);
                if (predecessors.length) {
                    gantt.autoSchedule(predecessors[0].source, false);
                }
            }
        });
        gantt.attachEvent("onParse", function () {
            if (gantt.config.auto_scheduling &&
                gantt.config.auto_scheduling_initial) {
                gantt.autoSchedule();
            }
        });
        function _preventCircularLink(id, link) {
            if (gantt.isCircularLink(link)) {
                gantt.callEvent("onCircularLinkError", [
                    link,
                    loopsFinder.getLoopContainingLink(link)
                ]);
                return false;
            }
            else {
                return true;
            }
        }
        function _preventDescendantLink(id, link) {
            var source = gantt.getTask(link.source);
            var target = gantt.getTask(link.target);
            if (!gantt.config.auto_scheduling_descendant_links) {
                if ((gantt.isChildOf(source.id, target.id) &&
                    gantt.isSummaryTask(target)) ||
                    (gantt.isChildOf(target.id, source.id) && gantt.isSummaryTask(source))) {
                    return false;
                }
            }
            return true;
        }
        gantt.attachEvent("onBeforeLinkAdd", _preventCircularLink);
        gantt.attachEvent("onBeforeLinkAdd", _preventDescendantLink);
        gantt.attachEvent("onBeforeLinkUpdate", _preventCircularLink);
        gantt.attachEvent("onBeforeLinkUpdate", _preventDescendantLink);
        function _datesNotEqual(dateA, dateB, taskA, taskB) {
            if (!!dateA !== !!dateB) {
                // if one of dates is empty or null and the other is not
                return true;
            }
            if (!dateA && !dateB) {
                return false;
            }
            if (dateA.valueOf() > dateB.valueOf()) {
                return gantt._hasDuration({
                    start_date: dateB,
                    end_date: dateA,
                    task: taskB
                });
            }
            else {
                return gantt._hasDuration({
                    start_date: dateA,
                    end_date: dateB,
                    task: taskA
                });
            }
        }
        function _notEqualTaskDates(task1, task2) {
            if (_datesNotEqual(task1.start_date, task2.start_date, task1, task2)) {
                return true;
            }
            if (gantt.getConstraintType(task1) !== gantt.getConstraintType(task2)) {
                return true;
            }
            if (_datesNotEqual(task1.constraint_date, task2.constraint_date, task1, task2)) {
                return true;
            }
            if (_datesNotEqual(task1.start_date, task2.start_date, task1, task2) ||
                ((_datesNotEqual(task1.end_date, task2.end_date, task1, task2) ||
                    task1.duration !== task2.duration) &&
                    task1.type !== gantt.config.types.milestone)) {
                return true;
            }
        }
        function getRelations(id) {
            // collect relations before drag and drop  in order to have original positions of subtasks within project since they are used as lag when moving dependent project
            // TODO: remove in 7.0
            if (gantt.config.auto_scheduling_compatibility) {
                // collect only downstream dependencies since there is no backward or ALAP scheduling in pre 6.1 auto scheduling
                return linksBuilder.getLinkedTasks(id, true);
            }
            else {
                // get all connected group (both upstream and downstream dependencies)
                return connectedGroupsHelper.getConnectedGroupRelations(id);
            }
        }
        var relations;
        var movedTask;
        gantt.attachEvent("onBeforeTaskDrag", function (id, mode, task) {
            if (gantt.config.auto_scheduling &&
                gantt.config.auto_scheduling_move_projects) {
                // collect relations before drag and drop  in order to have original positions of subtasks within project since they are used as lag when moving dependent project
                relations = getRelations(id);
                movedTask = id;
            }
            return true;
        });
        function resetToStartLinksLags(taskId, relationsArray) {
            // task duration is used as lag when converting start_to_start and start_to_finish into finish_to_start links
            // recalculate these links if task duration has changed
            var skipped = false;
            for (var i = 0; i < relations.length; i++) {
                var originalLink = gantt.getLink(relationsArray[i].id);
                if (originalLink &&
                    (originalLink.type === gantt.config.links.start_to_start ||
                        originalLink.type === gantt.config.links.start_to_finish)) {
                    relationsArray.splice(i, 1);
                    i--;
                    skipped = true;
                }
            }
            if (skipped) {
                var presentLinks = {};
                for (var i = 0; i < relationsArray.length; i++) {
                    presentLinks[relationsArray[i].id] = true;
                }
                var updatedLinks = getRelations(taskId);
                for (var i = 0; i < updatedLinks.length; i++) {
                    if (!presentLinks[updatedLinks[i].id]) {
                        relationsArray.push(updatedLinks[i]);
                    }
                }
            }
        }
        function updateTaskConstraints(task) {
            if (gantt.config.schedule_from_end) {
                task.constraint_type = gantt.config.constraint_types.FNLT;
                task.constraint_date = new Date(task.end_date);
            }
            else {
                task.constraint_type = gantt.config.constraint_types.SNET;
                task.constraint_date = new Date(task.start_date);
            }
        }
        function finalizeTaskConstraints(task) {
            // TODO: remove in 7.0
            if (gantt.config.auto_scheduling_compatibility && gantt.config.auto_scheduling_strict) {
                if (task.constraint_type === gantt.config.constraint_types.SNET ||
                    task.constraint_type === gantt.config.constraint_types.FNLT) {
                    task.constraint_type = null;
                    task.constraint_date = null;
                }
            }
        }
        var _autoScheduleAfterDND = function (taskId, task) {
            if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
                var newTask = gantt.getTask(taskId);
                if (_notEqualTaskDates(task, newTask)) {
                    updateTaskConstraints(newTask);
                    if (gantt.config.auto_scheduling_move_projects &&
                        // tslint:disable-next-line triple-equals
                        movedTask == taskId) {
                        if (gantt.calculateDuration(task) !== gantt.calculateDuration(newTask)) {
                            // task duration is used as lag when converting start_to_start and start_to_finish into finish to start links
                            // recalculate these links if task duration has changed
                            resetToStartLinksLags(taskId, relations);
                        }
                        gantt._autoSchedule(taskId, relations);
                    }
                    else {
                        gantt.autoSchedule(newTask.id);
                    }
                    finalizeTaskConstraints(newTask);
                }
            }
            relations = null;
            movedTask = null;
            return true;
        };
        var modifiedTaskId = null;
        if (gantt.ext && gantt.ext.inlineEditors) {
            var inlineEditors = gantt.ext.inlineEditors;
            var autoscheduleColumns_1 = {
                start_date: true,
                end_date: true,
                duration: true,
                constraint_type: true,
                constraint_date: true
            };
            inlineEditors.attachEvent("onBeforeSave", function (state) {
                if (autoscheduleColumns_1[state.columnName]) {
                    modifiedTaskId = state.id;
                }
                return true;
            });
        }
        var changedConstraint;
        function onBeforeLigthboxSaveHandler(taskId, task) {
            if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
                changedConstraint = false;
                var oldTask = gantt.getTask(taskId);
                if (_notEqualTaskDates(task, oldTask)) {
                    modifiedTaskId = taskId;
                    if (gantt.getConstraintType(task) !== gantt.getConstraintType(oldTask) ||
                        +task.constraint_date !== +oldTask.constraint_date) {
                        changedConstraint = true;
                    }
                }
            }
            return true;
        }
        function onAfterTaskUpdateHandler(taskId, task) {
            if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
                if (modifiedTaskId &&
                    // tslint:disable-next-line triple-equals
                    modifiedTaskId == taskId) {
                    modifiedTaskId = null;
                    if (!changedConstraint) {
                        updateTaskConstraints(task);
                    }
                    gantt.autoSchedule(task.id);
                    if (!changedConstraint) {
                        finalizeTaskConstraints(task);
                    }
                }
            }
            return true;
        }
        gantt.attachEvent("onBeforeTaskChanged", function (id, mode, task) {
            return _autoScheduleAfterDND(id, task);
        });
        if (gantt.ext.inlineEditors) {
            gantt.ext.inlineEditors.attachEvent("onBeforeSave", function (state) {
                if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
                    var api = gantt.ext.inlineEditors;
                    var editorConfig = api.getEditorConfig(state.columnName);
                    if (editorConfig.map_to === "start_date" || editorConfig.map_to === "end_date" || editorConfig.map_to === "duration") {
                        modifiedTaskId = state.id;
                    }
                }
                return true;
            });
        }
        gantt.attachEvent("onLightboxSave", onBeforeLigthboxSaveHandler);
        gantt.attachEvent("onAfterTaskUpdate", onAfterTaskUpdateHandler);
    };
    gantt.attachEvent("onGanttReady", function () {
        _attachAutoSchedulingHandlers();
        // attach handlers only when initialized for the first time
        _attachAutoSchedulingHandlers = function () { };
    });
}
exports.attachUIHandlers = attachUIHandlers;


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