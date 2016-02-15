
//from actions/index.js-----------------------------//
let nextTodoId = 0;
const addToDo = (text) => {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text
	}
};

const setVisibilityFilter = (filter) => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter
	}
};

const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	}
};

//end of actions/index.js-----------------------------//

//from reducers/todos.js------------------------------//

//******USE MORI************//

const todo = (state, action) => {
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

			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
};

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action)
			];
		case 'TOGGLE_TODO':
			return state.map(t =>
				todo(t, action)
			);
		default:
			return state;
	}
};
//end of reducers/todos.js------------------------------//

//from reducers/visibilityFilter.js ----------------------//

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch (action.type){
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};

//end of reducers/visibilityFilter.js -------------------//

//from reducers/index.js ----------------------//

const todoApp = Redux.combineReducers({
	todos,
	visibilityFilter
});

//end of reducers/index.js ----------------------//

//PRESENTATIONAL COMPONENTS
//from components/Todo.js--------------//

const Todo = ({onClick, completed, text}) => (
		<li
			onClick={onClick}
			style={{
				textDecoration: completed ? 'line-through' : 'none'
			}}
		>
			{text}
		</li>
	);

	Todo.propTypes = {
		onClick: React.PropTypes.func.isRequired,
		completed: React.PropTypes.bool.isRequired,
		text: React.PropTypes.string.isRequired
	};

//from components/TodoList.js------------------//

const TodoList = ({todos, onTodoClick}) => (
		<ul>
			{todos.map(todo =>
				<Todo
					key={todo.id}
					{...todo}
					onClick={() => onTodoClick(todo.id)}
				/>
			)}
		</ul>
	);

TodoList.propTypes = {
  todos: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    completed: React.PropTypes.bool.isRequired,
    text: React.PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTodoClick: React.PropTypes.func.isRequired
}

//from components/Link.js------------------------//

const Link = ({active, children, onClick}) => {
	if (active) {
		return <span>{children}</span>;
	}

	return (
		<a 	href="#"
			onClick={e => {
				e.preventDefault();
				onClick();
			}}
		>
			{children}
		</a>
	);	
};

Link.propTypes = {
	active: React.PropTypes.bool.isRequired,
	children: React.PropTypes.node.isRequired,
	onClick: React.PropTypes.func.isRequired
}

// from components/Footer.js-------------------------//

const Footer = () => (
	<p>
		Show:
		{" "}
		<FilterLink filter="SHOW_ALL">
			All
		</FilterLink>
		{", "}
		<FilterLink filter="SHOW_ACTIVE">
			Active
		</FilterLink>
		{", "}
		<FilterLink filter="SHOW_COMPLETED">
			Completed
		</FilterLink>
	</p>
);

//from components/App.js-------------------------------//

const App = () => (
	<div>
		<AddTodo />
		<VisibleTodoList />
		<Footer />
	</div>
);

//CONTAINER COMPONENTS
//from containers/VisibleTodoList.js--------------------//

//***************************MORI HERE TOO***********
const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
	}
};

const getVisibleTodosMSTP = (state) => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};

const getVisibleTodosMDTP = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id))
		}
	};
};

const VisibleTodoList = ReactRedux.connect(
	getVisibleTodosMSTP,
	getVisibleTodosMDTP
)(TodoList);

//from containers/FilterLink.js---------------------//

const filterlinkMSTP = (state, ownProps) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
};

const filterlinkMDTP = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter));
		}
	};
};

const FilterLink = ReactRedux.connect(
	filterlinkMSTP,
	filterlinkMDTP
)(Link);

//from containers/AddTodo.js---------------------------//

let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node
			}} />
			<button onClick={() =>{
				dispatch(addToDo(input.value))
				input.value = '';
			}}>
				Add Todo
			</button>
		</div>
	);
}
AddTodo = ReactRedux.connect()(AddTodo);

//from index.js --------------------------------------//

const finalCreateStore = Redux.compose(
	 window.devToolsExtension ? window.devToolsExtension() : f => f
)(Redux.createStore);

let store = finalCreateStore(todoApp); 

let Provider = ReactRedux.Provider;

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

//end of index.js --------------------------------------