import React, { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessageType } from '../types/ErrorMessageType';

type TodoContextType = {
  todos: Todo[] | null;
  setTodos: (todo: Todo[]) => void;
  errorType: ErrorMessageType | null;
  setErrorType: (error: ErrorMessageType) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: null,
  setTodos: () => {},
  errorType: null,
  setErrorType: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [errorType, setErrorType] = useState<ErrorMessageType | null>(null);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      errorType,
      setErrorType,
    }),
    [todos, errorType],
  );

  // prettier-ignore
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
