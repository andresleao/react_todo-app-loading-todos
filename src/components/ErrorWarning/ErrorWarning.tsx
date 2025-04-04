import cn from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessageType } from '../../types/ErrorMessageType';

export const ErrorWarning = () => {
  const { errorType } = useContext(TodoContext);

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

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorType,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {getErrorMessage()}
    </div>
  );
};
