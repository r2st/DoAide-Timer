import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function TodoList({ compact }) {
  const [todos, setTodos] = useLocalStorage('doaide-todos', [])
  const [input, setInput] = useState('')

  function addTodo(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }])
    setInput('')
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  const pending = todos.filter((t) => !t.done).length
  const done = todos.filter((t) => t.done).length

  return (
    <div className={`todo-list ${compact ? 'compact' : ''}`}>
      <div className="todo-header">
        <h3>Tasks {pending > 0 && <span className="todo-count">{pending}</span>}</h3>
        {done > 0 && <button className="clear-done-btn" onClick={clearDone}>Clear done ({done})</button>}
      </div>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="add-todo-btn" disabled={!input.trim()}>+</button>
      </form>
      <div className="todo-items">
        {todos.map((t) => (
          <div key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
            <button className="todo-check" onClick={() => toggleTodo(t.id)}>
              {t.done ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><polyline points="9,12 11,14 15,10" stroke="#fff" strokeWidth="2.5" fill="none" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
              )}
            </button>
            <span className="todo-text">{t.text}</span>
            <button className="todo-delete" onClick={() => deleteTodo(t.id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
        {todos.length === 0 && <div className="empty-state">No tasks yet. Add one above.</div>}
      </div>
    </div>
  )
}
