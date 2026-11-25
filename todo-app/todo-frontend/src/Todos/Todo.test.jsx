import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Todo from './Todo'

afterEach(cleanup)

describe('Todo', () => {
  it('shows an incomplete todo and calls its actions with that todo', () => {
    const todo = { text: 'Learn containers', done: false }
    const deleteTodo = vi.fn()
    const completeTodo = vi.fn()
    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />)

    expect(screen.getByText('Learn containers')).toBeTruthy()
    expect(screen.getByText('This todo is not done')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Set as done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(completeTodo).toHaveBeenCalledWith(todo)
    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })

  it('shows a completed todo without a completion button', () => {
    const todo = { text: 'Finished task', done: true }
    const deleteTodo = vi.fn()
    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={vi.fn()} />)

    expect(screen.getByText('Finished task')).toBeTruthy()
    expect(screen.getByText('This todo is done')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Set as done' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })
})
