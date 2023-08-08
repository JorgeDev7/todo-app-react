import { useState, useEffect } from 'react'
import ListItem from './components/ListItem'

// DND
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

// icons
import moon from '/assets/images/icon-moon.svg'
import sun from '/assets/images/icon-sun.svg'

// Active buttons
const headers = ["All", "Active", "Completed"];

function App() {

  // MAIN STATE
  const [listItems, setListItems] = useState(JSON.parse(localStorage.getItem('todos')) ?? []);

  const [todo, setTodo] = useState('');
  const [dark, setDark] = useState(false);
  const [activeButton, setActiveButton] = useState(0);

  // Almacenar en localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(listItems));
  }, [listItems]);

  const handleSetTodo = e => {
    if (e.keyCode === 13) {
      setListItems([...listItems, {
        id: Math.random().toString(32).substring(2),
        text: todo,
        done: false
      }]);
      setTodo('');
    }
  }

  const viewAllItems = () => {

    const todoCompleted = document.querySelectorAll('.todo')

    todoCompleted.forEach(item => {
      if (item.classList.contains('hidden')) {
        item.classList.remove('hidden')
      }
    })
  }

  const viewActiveItems = () => {
    const todoCompleted = document.querySelectorAll('.todo')

    todoCompleted.forEach(item => {
      if (item.classList.contains('taskCompleted')) {
        item.classList.add('hidden')
      } else if (item.classList.contains('todoActive')) {
        item.classList.remove('hidden')
      }
    })

  }

  const viewCompletedItems = () => {

    const todoCompleted = document.querySelectorAll('.todo')

    todoCompleted.forEach(item => {
      if (item.classList.contains('hidden')) {
        item.classList.remove('hidden')
      }
      if (item.classList.contains('todoActive')) {
        item.classList.add('hidden')
      }
    })

  }

  const handleClearTodos = () => {
    const deleteCompletedTodos = listItems.filter(item => item.done !== true);

    setListItems(deleteCompletedTodos);
  }

  // dark mode to the HTML File
  if (dark) {
    document.querySelector('body').classList.add('bg-very-dark-blue', 'transition-all', 'duration-500');
  } else {
    document.querySelector('body').classList.add('bg-slate-100');
    document.querySelector('body').classList.remove('bg-very-dark-blue');
  }

  const handleDragEnd = (e) => {
    const { active, over } = e;

    setListItems((listItems) => {
      const oldIndex = listItems.findIndex(item => item.id === active.id);
      const newIndex = listItems.findIndex(item => item.id === over.id);

      return arrayMove(listItems, oldIndex, newIndex)
    });
  }

  return (
    <>
      <div className={`${dark ? 'bg-[url(/assets/images/bg-mobile-dark.jpg)] md:bg-[url(/assets/images/bg-desktop-dark.jpg)]' : 'bg-[url(/assets/images/bg-mobile-light.jpg)] md:bg-[url(/assets/images/bg-desktop-light.jpg)]'} h-[200px] md:h-[300px] bg-cover pt-8 md:pt-20`}>
        <header className="container px-5 lg:px-52 xl:px-64 2xl:px-80 mx-auto flex items-center justify-between">
          <h1 className='text-4xl uppercase tracking-[13px] font-bold text-very-light-gray'>Todo</h1>
          <img
            src={dark ? sun : moon}
            alt="icon dark mode toggle"
            className='cursor-pointer hover:scale-110 transition-all'
            onClick={() => setDark(!dark)}
          />
        </header>

        <form
          className='mt-10 md:mt-16'
          onSubmit={e => e.preventDefault()}
        >
          <div className="container px-5 lg:px-52 xl:px-64 2xl:px-80 mx-auto">
            <div className={`${dark ? 'bg-very-dark-desaturated-blue' : 'bg-white'} transition-all duration-500 flex items-center gap-3 px-5 py-4 rounded-md`}>
              <div className='border-2 rounded-full p-2'></div>
              <input
                type="text"
                name="todo"
                id="todo"
                value={todo}
                onChange={e => setTodo(e.target.value)}
                onKeyDown={handleSetTodo}
                className={`${dark ? 'bg-very-dark-desaturated-blue text-light-grayish-blue' : 'bg-white'} w-full focus-visible:outline-none text-sm md:text-base transition-all duration-500`}
                placeholder='Create a new todo...'
              />
            </div>
          </div>
        </form>

        <div className='mt-5 container px-5 lg:px-52 xl:px-64 2xl:px-80 mx-auto'>
          <ul
            className={`${dark ? 'bg-very-dark-desaturated-blue' : 'bg-white'} shadow-xl rounded-md px-1 transition-all duration-500`}
          >
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {listItems.length ? (
                <SortableContext
                  items={listItems}
                  strategy={verticalListSortingStrategy}
                >
                  {listItems?.map(item => (
                    < ListItem
                      key={item.id}
                      item={item}
                      listItems={listItems}
                      setListItem={setListItems}
                      darkmode={dark}
                    />

                  ))}
                </SortableContext>
              ) : <p className='text-dark-grayish-blue text-center p-10 font-bold uppercase'>Your List is empty, Create a TODO</p>}
            </DndContext>
            <li className='flex items-center justify-between gap-3 py-6 px-4 border-b last-of-type:border-b-0'>
              <p className='text-sm md:text-base text-dark-grayish-blue'>{listItems.length} items left</p>
              <div className='hidden md:flex md:gap-5 md:items-center'>
                {headers.map((text, index) => (
                  <button
                    key={index}
                    type='button'
                    className={`text-sm md:text-base ${dark ? 'hover:text-light-grayish-blue-hover' : 'hover:text-very-dark-blue'} ${activeButton === index ? 'text-blue-500' : 'text-dark-grayish-blue'} font-bold`}
                    onClick={() => {
                      setActiveButton(index)

                      if (text === 'All') {
                        viewAllItems()
                      }

                      if (text === 'Active') {
                        viewActiveItems()
                      }

                      if (text === 'Completed') {
                        viewCompletedItems();
                      }
                    }}
                  >{text}</button>
                ))}
              </div>
              <button
                type='button'
                className={`text-sm md:text-base ${dark ? 'hover:text-light-grayish-blue-hover' : ''} text-dark-grayish-blue cursor-pointer`}
                onClick={handleClearTodos}
              >Clear Completed</button>
            </li>
          </ul>

          <div className={`${dark ? 'bg-very-dark-desaturated-blue' : 'bg-white'} flex items-center justify-center gap-5 py-6 px-4 mt-6 rounded-md shadow-md md:hidden transition-all duration-500`}>
            {headers.map((text, index) => (
              <button
                key={index}
                type='button'
                className={`text-sm md:text-base ${dark ? 'hover:text-light-grayish-blue-hover' : 'hover:text-very-dark-blue'} ${activeButton === index ? 'text-blue-500' : 'text-dark-grayish-blue'} font-bold`}
                onClick={() => {
                  setActiveButton(index)

                  if (text === 'All') {
                    viewAllItems()
                  }

                  if (text === 'Active') {
                    viewActiveItems()
                  }

                  if (text === 'Completed') {
                    viewCompletedItems();
                  }
                }}
              >{text}</button>
            ))}
          </div>
        </div>

        <div className='container px-5 lg:px-52 xl:px-64 2xl:px-80 mx-auto mt-12'>
          <h2 className='text-center text-dark-grayish-blue'>Drag and drop to reorder list </h2>
        </div>
      </div>
    </>
  )
}

export default App
