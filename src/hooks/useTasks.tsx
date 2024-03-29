import { DragEvent, useState } from 'react';
import { useTaskStore } from '../stores';
import Swal from 'sweetalert2';
import { TaskStatus } from '../stores/interfaces';

export const useTasks = ( status: TaskStatus ) => {

  const isDragging = useTaskStore( state => !!state.draggingTaskId );
  const removeDraggingTaskId = useTaskStore( state => state.removeDraggingTaskId );
  const onTaskDrop = useTaskStore( state => state.onTaskDrop );
  const addTask = useTaskStore( state => state.addTask );

  const [ onDragOver, setOnDragOver ] = useState( false );

  const handleDragOver = ( e: DragEvent<HTMLDivElement> ) => {
    e.preventDefault();
    setOnDragOver( true );
  };

  const handleDragLeave = ( e: DragEvent<HTMLDivElement> ) => {
    e.preventDefault();
    setOnDragOver( false );
  };

  const handleDrop = ( e: DragEvent<HTMLDivElement> ) => {
    e.preventDefault();
    setOnDragOver( false );
    onTaskDrop( status );
    removeDraggingTaskId();
  };

  const handleAddTask = async () => {
    const { isConfirmed, value } = await Swal.fire( {
      title: 'Nueva tarea',
      input: 'text',
      inputLabel: 'Nombre de la tarea',
      inputPlaceholder: 'Ingrese el nombre de la tarea',
      showCancelButton: true,
      inputValidator: ( value ) => {
        if ( !value ) {
          return 'Debe ingresar un nombre para la tarea';
        }
      }
    } );

    if ( !isConfirmed ) return;

    addTask( value, status );
  };

  return {
    onDragOver,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAddTask,
  };
};