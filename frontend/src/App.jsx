import { useState, useEffect } from 'react'

function App() {
    
  return (
    <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    
    <header class="bg-white shadow-sm">
        <div
          class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
        >
          <div class="flex items-center space-x-2">
            <button class="text-xl font-semibold text-gray-800">eKapituła HKK</button>
          </div>
          <div class="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-6">
            <button class="text-sm font-medium text-gray-800 hover:text-blue-800">
              Użytkownicy
            </button>
            <button class="text-sm font-medium text-gray-800 hover:text-blue-800">
              Wszystkie próby
            </button>
          </div>
          <div class="flex items-center space-x-2">
          <button
              class="material-symbols-outlined text-white bg-gray-900 p-2 rounded-lg"              
            >
              dark_mode
            </button>
            <button
              class="material-symbols-outlined text-white bg-green-500 p-2 rounded-lg"
            >
              person
            </button>
  
            <button
              class="material-symbols-outlined text-white cursor-pointer bg-red-500 p-2 rounded-lg"
            >
              logout
            </button>
          </div>
        </div>
      </header>

        
      <main class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-semibold text-gray-800">
              wyw. Jakub Prażuch próba na stopień HO
            </h2>
            <div class="flex space-x-2">
                <button class="flex items-center bg-gray-200 p-2 rounded-lg hover:bg-gray-300 cursor-pointer">                  
                  <span class="material-symbols-outlined">
                  list_alt_check
                  </span>
                  <span class="ml-2">Zgłoś próbę do opiekuna</span>
                </button>
                <button class="cursor-pointer">
                  <span
                    class="material-symbols-outlined bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                  >
                    edit_square
                  </span>
                </button>
                <button class="cursor-pointer">
                  <span
                    class="material-symbols-outlined bg-red-300 p-2 rounded-lg hover:bg-red-400"
                  >
                    delete
                  </span>
                </button>
              </div>
              
          </div>
          <div class="flex space-x-4">
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p class="font-semibold">Stan:</p>
              <span>do akceptacji przez opiekuna</span>
            </div>
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p class="font-semibold">Data zakończenia:</p>
              <span>marzec 2026</span>
            </div>
          </div>
          

          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
                <p class="text-sm text-gray-500">Email do kontaktu</p>
                <p class="font-medium">jakub.prazuch@malopolska.zhr.pl</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Email opiekuna</p>
                <p class="font-medium">andrzej.zarnowski@malopolska.zhr.pl</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Data urodzenia</p>
                <p class="font-medium">25 lipca 2005</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Imię i nazwisko opiekuna</p>
                <p class="font-medium">Andrzej Żarnowski</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Drużyna</p>
                <p class="font-medium">40 KDH Barykada</p>
            </div>          
        </div>
        
        <div class="mt-12">
            <h3 class="text-xl font-medium mb-4">Zadania</h3>
            <table class="w-full">
                <thead class="bg-gray-50 text-left text-sm">
                    <tr>
                        <th class="p-3">Lp</th>
                        <th class="p-3">Treść zadania</th>
                        <th class="p-3">Kategoria zadania</th>
                        <th class="p-3">Data zakończenia</th>
                        <th class="p-3">Edycja</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr>
                        <td class="p-3">1</td>
                        <td class="p-3 max-w-[300px]">
                            Będę regularnie uczył się muzyki aby osiągnąć wynik 12% na egzaminie maturalnym
                        </td>
                        <td class="p-3 flex-column space-y-2">
                            
                            <div class="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                                <span class="material-symbols-outlined">school</span>
                                <span>Rozwój intelektualny i zawodowy</span>
                              </div>

                              <div class="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                                <span class="material-symbols-outlined">sentiment_very_satisfied</span>
                                <span>Praca nad charakterem</span>
                              </div>

                              <button class="bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                                <span class="material-symbols-outlined">add</span>
                                
                              </button>

                        </td>
                        <td class="p-3">


                            marzec 2026

                        </td>
                        <td class="p-3">
                            <span class="material-symbols-outlined text-gray-400 hover:text-gray-600 cursor-pointer">edit</span>
                            <span class="material-symbols-outlined text-gray-400 hover:text-red-600 cursor-pointer">delete</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="p-3">2</td>
                        <td class="p-3 max-w-[300px]">
                            Nie będę nic robić regularnie przez najbliższe 2 miesiące żeby ćwiczyć technikę “nionierobienia”
                        </td>
                        <td class="p-3 flex-column space-y-2">

                            <div class="bg-pink-200 text-pink-900 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                                <span class="material-symbols-outlined">diversity_4</span>
                                <span>Powołanie, wychowanie prorodzinne</span>
                              </div>

                              <button class="bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
                                <span class="material-symbols-outlined">add</span>
                                
                              </button>


                        </td>
                        <td class="p-3">

                          październik 2025

                        </td>
                        <td class="p-3">
                            <span class="material-symbols-outlined text-gray-400 hover:text-gray-600 cursor-pointer">edit</span>
                            <span class="material-symbols-outlined text-gray-400 hover:text-red-600 cursor-pointer">delete</span>
                        </td>
                    </tr>
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
                    <p class="text-sm text-gray-500">23 lipca 2024</p>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="font-medium">Andrzej Żarnowski:</p>
                        <p>Jak dla mnie jest w porządku! :)</p>
                    </div>
                </div>
                <div class="border-t border-gray-200 pt-4">
                    <div class="flex items-center space-x-2">
                        <input 
                            type="text" 
                            placeholder="Twój komentarz" 
                            class="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <button class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
      </main>  
    

  </div>
  )
}

export default App
