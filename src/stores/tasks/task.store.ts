import { StateCreator, create } from 'zustand';
import type { Task, TaskStatus } from '../interfaces';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
// import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { customSessionStorage } from '../storages/session.storage';

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>;

  getTaskByStatus( status: TaskStatus ): Task[];
  getTotalTask: () => number;
  addTask: ( title: string, status: TaskStatus ) => void;

  setDraggingTaskId: ( taskId: string ) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: ( taskId: string, status: TaskStatus ) => void;
  onTaskDrop: ( status: TaskStatus ) => void;
}

const storeApi: StateCreator<TaskState, [ [ "zustand/immer", never ] ]> =
  ( set, get ) => ( {
    draggingTaskId: undefined,
    tasks: {
      'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
      'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
      'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
      'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' }
    },
    getTaskByStatus: ( status: TaskStatus ) => {
      const tasks = get().tasks;
      return Object.values( tasks ).filter( task => task.status === status );
    },
    getTotalTask: () => Object.values( get().tasks ).length,
    addTask: ( title: string, status: TaskStatus ) => {
      const newTask = { id: uuidv4(), title, status };

      set( state => {
        state.tasks[ newTask.id ] = newTask;
      } );

      // Requiere npm intall immer
      // set( produce( ( state ) => {
      //   state.tasks[ newTask.id ] = newTask;
      // } ) );

      // Forma nativa zustand
      // set( ( state ) => ( {
      //   tasks: {
      //     ...state.tasks,
      //     [ newTask.id ]: newTask
      //   }
      // } ) );
    },
    setDraggingTaskId: ( taskId: string ) => {
      set( { draggingTaskId: taskId } );
    },
    removeDraggingTaskId: () => set( { draggingTaskId: undefined } ),
    changeTaskStatus: ( taskId: string, status: TaskStatus ) => {
      set( state => {
        state.tasks[ taskId ] = {
          ...state.tasks[ taskId ],
          status,
        };
      } );
    },
    onTaskDrop: ( status: TaskStatus ) => {
      const taskId = get().draggingTaskId;
      if ( !taskId ) return;

      get().changeTaskStatus( taskId, status );
      get().draggingTaskId = taskId;
    }
  } );

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      immer( storeApi ),
      { name: 'taskstore', storage: customSessionStorage }
    )
  )
);