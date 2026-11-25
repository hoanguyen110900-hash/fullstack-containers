import { Fragment } from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => (
  <>
    {todos.map(todo => (
      <Fragment key={todo._id}>
        <hr />
        <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
      </Fragment>
    ))}
  </>
)

export default TodoList
