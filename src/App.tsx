import { useState } from 'react';
import { StudentListContainer } from './containers/StudentListContainer';
import { TaskBoardContainer } from './containers/TaskBoardContainer';
import './App.css';

type Tab = 'students' | 'tasks';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          className={`app-tab${activeTab === 'tasks' ? ' app-tab--active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Task Board
        </button>
        <button
          className={`app-tab${activeTab === 'students' ? ' app-tab--active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
      </nav>

      {activeTab === 'tasks' ? <TaskBoardContainer /> : <StudentListContainer />}
    </div>
  );
}

export default App;
