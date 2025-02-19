import { useState, useEffect, useRef } from 'react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark;
    }
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      content: 'Będę regularnie uczył się muzyki aby osiągnąć wynik 12% na egzaminie maturalnym',
      category: 'Rozwój intelektualny i zawodowy',
      endDate: 'marzec 2026',
    },
    {
      id: 2,
      content: 'Nie będę nic robić regularnie przez najbliższe 2 miesiące żeby ćwiczyć technikę “nionierobienia”',
      category: 'Powołanie, wychowanie prorodzinne',
      endDate: 'październik 2025',
    },
  ]);

  const [editTaskId, setEditTaskId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editEndDate, setEditEndDate] = useState('');  

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const textareas = document.querySelectorAll('.auto-resize-textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditContent(task.content);
    setEditEndDate(task.endDate);
  };

  const handleApproveClick = () => {
    setTasks(tasks.map(task => 
      task.id === editTaskId ? { ...task, content: editContent, endDate: editEndDate } : task
    ));
    setEditTaskId(null);
  };

  const handleCancelClick = () => {     
    setEditTaskId(null);
  };

  return (
    <div class="bg-gray-100 dark:bg-black min-h-screen dark:text-gray-100 text-gray-800">
      <header class="bg-white dark:bg-gray-900 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button class="text-xl font-semibold dark:text-gray-100">eKapituła HKK</button>
          </div>
          <div class="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-6">
            <button class="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300">Użytkownicy</button>
            <button class="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300">Wszystkie próby</button>
          </div>
          <div class="flex items-center space-x-2">
            <button class="material-symbols-outlined bg-gray-900 dark:bg-gray-100 dark:text-gray-800 text-gray-100 p-2 rounded-lg" onClick={toggleDarkMode}>
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </button>
            <button class="material-symbols-outlined bg-green-500 p-2 rounded-lg">person</button>
            <button class="material-symbols-outlined bg-red-500 p-2 rounded-lg">logout</button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-semibold">wyw. Jakub Prażuch próba na stopień HO</h2>
            <div class="flex space-x-2">
              <button class="flex items-center bg-gray-200 p-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800">
                <span class="material-symbols-outlined">list_alt_check</span>
                <span class="ml-2">Zgłoś próbę do opiekuna</span>
              </button>
              <button>
                <span class="material-symbols-outlined bg-gray-200 p-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800">edit_square</span>
              </button>
              <button>
                <span class="material-symbols-outlined bg-red-300 p-2 rounded-lg hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-800">delete</span>
              </button>
            </div>
          </div>
          <div class="flex space-x-4">
            <div class="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p class="font-semibold">Stan:</p>
              <span>do akceptacji przez opiekuna</span>
            </div>
            <div class="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p class="font-semibold">Data zakończenia:</p>
              <span>marzec 2026</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p class="text-sm text-gray-400">Email do kontaktu</p>
              <p class="font-medium">jakub.prazuch@malopolska.zhr.pl</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Email opiekuna</p>
              <p class="font-medium">andrzej.zarnowski@malopolska.zhr.pl</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Data urodzenia</p>
              <p class="font-medium">25 lipca 2005</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Imię i nazwisko opiekuna</p>
              <p class="font-medium">Andrzej Żarnowski</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Drużyna</p>
              <p class="font-medium">40 KDH Barykada</p>
            </div>
          </div>

          <div class="mt-12">
            <h3 class="text-xl font-medium mb-4">Zadania</h3>
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700 text-left text-sm">
                <tr>
                  <th class="p-3" style={{ width: '1%' }}>Lp</th>
                  <th class="p-3" style={{ width: '50%' }}>Treść zadania</th>
                  <th class="p-3" style={{ width: '27%' }}>Kategoria zadania</th>
                  <th class="p-3" style={{ width: '15%' }}>Data zakończenia</th>
                  <th class="p-3" style={{ width: '7%' }}>Edycja</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td class="p-3">{index + 1}</td>
                    <td class="p-3">
                      {editTaskId === task.id ? (
                        <textarea                        
                        className="auto-resize-textarea resize-none w-full overflow-hidden break-words rounded-lg border border-gray-200 dark:border-gray-700 p-2 focus:outline-none "
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}                                         
                        placeholder="Treść zadania"
                        rows={1}
                      ></textarea>
                      ) : (
                        <textarea                       
                        className="auto-resize-textarea resize-none w-full overflow-hidden break-words rounded-lg border border-white dark:border-gray-900 p-2 focus:outline-none"
                        value={task.content}
                        rows={1}
                        readOnly
                      ></textarea>
                      )}
                    </td>
                    <td class="p-3 flex-column space-y-2">
                      <div class="bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-200 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                        <span class="material-symbols-outlined">diversity_4</span>
                        <span>{task.category}</span>
                      </div>
                    </td>
                    <td class="p-3">
                      {editTaskId === task.id ? (
                        <button
                                                  
                          
                          onChange={(e) => setEditEndDate(e.target.value)}
                          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between"
                        >
                          <p>{editEndDate}</p>
                        
                        <span class="material-symbols-outlined">calendar_month</span>

                        </button>
                      ) : (
                        <button                        
                        className="w-full rounded-lg border border-white dark:border-gray-900 p-2 focus:outline-none"
                        
                        >{task.endDate}
                        
                        

                        </button>
                      )}
                    </td>
                    <td class="p-3">
                      {editTaskId === task.id ? (
                        <>
                          <button
                            class="material-symbols-outlined text-green-600 hover:text-green-800"
                            onClick={handleApproveClick}
                          >
                            check
                          </button>
                          <button
                            class="material-symbols-outlined text-red-600 hover:text-red-800"
                            onClick={handleCancelClick}
                          >
                            close
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            class="material-symbols-outlined text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditClick(task)}
                          >
                            edit
                          </button>
                          <button class="material-symbols-outlined text-gray-400 hover:text-red-600">delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button class="mt-4 flex items-center text-blue-600 hover:text-blue-800">
              <span class="material-symbols-outlined mr-1">add</span>
              Nowe zadanie
            </button>
          </div>

          <div class="space-y-6 mt-12">
            <h3 class="text-xl font-medium">Komentarze</h3>
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">23 lipca 2024</p>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p class="font-medium">Andrzej Żarnowski:</p>
                  <p>Jak dla mnie jest w porządku! :)</p>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Twój komentarz"
                    class="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600"
                  />
                  <button class="material-symbols-outlined text-blue-600 hover:text-blue-800">send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;