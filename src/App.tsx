/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */

import React, { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, updateTodo, USER_ID } from './api/todos';
import { Todos } from './components/Todos';
import { TodoContext } from './context/TodoContext';
import { Todo } from './types/Todo';
import { ErrorMessageType } from './types/ErrorMessageType';
import cn from 'classnames';

export const App: React.FC = () => {
  const { todos, setTodos, errorType, setErrorType } = useContext(TodoContext);
  const [title, setTitle] = useState('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorType(ErrorMessageType.Title);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title,
      completed: false,
    };

    try {
      const response = await createTodo(newTodo);

      if (response) {
        const newTodosList = await getTodos();

        if (newTodosList) {
          setTodos([...newTodosList]);
          setTitle('');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);

        return;
      }

      console.log(error);
    }
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case ErrorMessageType.Loading:
        return 'Unable to load todos';
      case ErrorMessageType.Add:
        return 'Unable to add a todo';
      case ErrorMessageType.Delete:
        return 'Unable to delete a todo';
      case ErrorMessageType.Update:
        return 'Unable to update a todo';
      case ErrorMessageType.Title:
        return 'Title should not be empty';
      default:
        return '';
    }
  };

  const setAllTodosCompleted = async () => {
    try {
      if (todos) {
        const completedTodos = todos.filter(todo => todo.completed);

        if (completedTodos.length === 0) {
          return;
        }

        await Promise.all(
          completedTodos.map(todo => updateTodo({ ...todo, completed: false })),
        );

        const updatedTodos = await getTodos();

        if (updatedTodos) {
          setTodos(updatedTodos);
        }
      }
    } catch (error) {
      setErrorType(ErrorMessageType.Update);
      throw new Error('An error ocurred');
    }
  };

  const isAllTodosCompleted = todos && todos?.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={setAllTodosCompleted}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleOnSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleOnChange}
            />
          </form>
        </header>

        <Todos />

        {/* Hide the footer if there are no todos */}

        {todos && todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              3 items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className="filter__link selected"
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {getErrorMessage()}
      </div>
    </div>
  );
};
