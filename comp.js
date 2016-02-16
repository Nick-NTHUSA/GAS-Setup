'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//from actions/index.js-----------------------------//
var nextTodoId = 0;
var addToDo = function addToDo(text) {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text: text
	};
};

var setVisibilityFilter = function setVisibilityFilter(filter) {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter: filter
	};
};

var toggleTodo = function toggleTodo(id) {
	return {
		type: 'TOGGLE_TODO',
		id: id
	};
};

//end of actions/index.js-----------------------------//

//from reducers/todos.js------------------------------//

//******USE MORI************//

var todo = function todo(state, action) {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}

			return _extends({}, state, {
				completed: !state.completed
			});
		default:
			return state;
	}
};

var todos = function todos() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_TODO':
			return [].concat(_toConsumableArray(state), [todo(undefined, action)]);
		case 'TOGGLE_TODO':
			return state.map(function (t) {
				return todo(t, action);
			});
		default:
			return state;
	}
};
//end of reducers/todos.js------------------------------//

//from reducers/visibilityFilter.js ----------------------//

var visibilityFilter = function visibilityFilter() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? 'SHOW_ALL' : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};

//end of reducers/visibilityFilter.js -------------------//

//from reducers/index.js ----------------------//

var todoApp = Redux.combineReducers({
	todos: todos,
	visibilityFilter: visibilityFilter
});

//end of reducers/index.js ----------------------//

//PRESENTATIONAL COMPONENTS
//from components/Todo.js--------------//

var Todo = function Todo(_ref) {
	var onClick = _ref.onClick;
	var completed = _ref.completed;
	var text = _ref.text;
	return React.createElement(
		'li',
		{
			onClick: onClick,
			style: {
				textDecoration: completed ? 'line-through' : 'none'
			}
		},
		text
	);
};

Todo.propTypes = {
	onClick: React.PropTypes.func.isRequired,
	completed: React.PropTypes.bool.isRequired,
	text: React.PropTypes.string.isRequired
};

//from components/TodoList.js------------------//

var TodoList = function TodoList(_ref2) {
	var todos = _ref2.todos;
	var onTodoClick = _ref2.onTodoClick;
	return React.createElement(
		'ul',
		null,
		todos.map(function (todo) {
			return React.createElement(Todo, _extends({
				key: todo.id
			}, todo, {
				onClick: function onClick() {
					return onTodoClick(todo.id);
				}
			}));
		})
	);
};

TodoList.propTypes = {
	todos: React.PropTypes.arrayOf(React.PropTypes.shape({
		id: React.PropTypes.number.isRequired,
		completed: React.PropTypes.bool.isRequired,
		text: React.PropTypes.string.isRequired
	}).isRequired).isRequired,
	onTodoClick: React.PropTypes.func.isRequired
};

//from components/Link.js------------------------//

var Link = function Link(_ref3) {
	var active = _ref3.active;
	var children = _ref3.children;
	var _onClick = _ref3.onClick;

	if (active) {
		return React.createElement(
			'span',
			null,
			children
		);
	}

	return React.createElement(
		'a',
		{ href: '#',
			onClick: function onClick(e) {
				e.preventDefault();
				_onClick();
			}
		},
		children
	);
};

Link.propTypes = {
	active: React.PropTypes.bool.isRequired,
	children: React.PropTypes.node.isRequired,
	onClick: React.PropTypes.func.isRequired
};

// from components/Footer.js-------------------------//

var Footer = function Footer() {
	return React.createElement(
		'p',
		null,
		'Show:',
		" ",
		React.createElement(
			FilterLink,
			{ filter: 'SHOW_ALL' },
			'All'
		),
		", ",
		React.createElement(
			FilterLink,
			{ filter: 'SHOW_ACTIVE' },
			'Active'
		),
		", ",
		React.createElement(
			FilterLink,
			{ filter: 'SHOW_COMPLETED' },
			'Completed'
		)
	);
};

//from components/App.js-------------------------------//

var App = function App() {
	return React.createElement(
		'div',
		null,
		React.createElement(AddTodo, null),
		React.createElement(VisibleTodoList, null),
		React.createElement(Footer, null)
	);
};

//CONTAINER COMPONENTS
//from containers/VisibleTodoList.js--------------------//

//***************************MORI HERE TOO***********
var getVisibleTodos = function getVisibleTodos(todos, filter) {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(function (t) {
				return t.completed;
			});
		case 'SHOW_ACTIVE':
			return todos.filter(function (t) {
				return !t.completed;
			});
	}
};

var getVisibleTodosMSTP = function getVisibleTodosMSTP(state) {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};

var getVisibleTodosMDTP = function getVisibleTodosMDTP(dispatch) {
	return {
		onTodoClick: function onTodoClick(id) {
			dispatch(toggleTodo(id));
		}
	};
};

var VisibleTodoList = ReactRedux.connect(getVisibleTodosMSTP, getVisibleTodosMDTP)(TodoList);

//from containers/FilterLink.js---------------------//

var filterlinkMSTP = function filterlinkMSTP(state, ownProps) {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
};

var filterlinkMDTP = function filterlinkMDTP(dispatch, ownProps) {
	return {
		onClick: function onClick() {
			dispatch(setVisibilityFilter(ownProps.filter));
		}
	};
};

var FilterLink = ReactRedux.connect(filterlinkMSTP, filterlinkMDTP)(Link);

//from containers/AddTodo.js---------------------------//

var AddTodo = function AddTodo(_ref4) {
	var dispatch = _ref4.dispatch;

	var input = undefined;

	return React.createElement(
		'div',
		null,
		React.createElement('input', { ref: function ref(node) {
				input = node;
			} }),
		React.createElement(
			'button',
			{ onClick: function onClick() {
					dispatch(addToDo(input.value));
					input.value = '';
				} },
			'Add Todo'
		)
	);
};
AddTodo = ReactRedux.connect()(AddTodo);

//from index.js --------------------------------------//

var finalCreateStore = Redux.compose(window.devToolsExtension ? window.devToolsExtension() : function (f) {
	return f;
})(Redux.createStore);

var store = finalCreateStore(todoApp);

var Provider = ReactRedux.Provider;

ReactDOM.render(React.createElement(
	Provider,
	{ store: store },
	React.createElement(App, null)
), document.getElementById('root'));

//end of index.js --------------------------------------
