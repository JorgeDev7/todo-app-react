import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

// DND
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import check from '/assets/images/icon-check.svg'
import cross from '/assets/images/icon-cross.svg'

const ListItem = ({ darkmode, item, listItems, setListItem }) => {

    const { text, id, done } = item;

    const [isOpen, setIsOpen] = useState(false);

    // DND Hook
    const { attributes, listeners, setNodeRef, transition, transform } = useSortable({
        id: id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const handleEliminarItem = () => {
        const itemEliminado = listItems.filter(item => item.id !== id);
        setListItem(itemEliminado);
    }

    const handleSetCompleted = id => {

        const todoUpdated = listItems.map(item => {
            if (item.id === id) {
                item.done = true
            }

            return item
        });
        setListItem(todoUpdated)

    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className={`flex items-center justify-between gap-3 py-6 px-4 todo ${done ? 'taskCompleted' : 'todoActive'}`}>
                <li
                    className={`border-b last-of-type:border-b-0 cursor-move`}
                >
                    <div
                        className='flex items-center gap-3'
                    >
                        <div className={`border-2 rounded-full cursor-pointer`}>
                            <div
                                className={`${darkmode ? 'bg-very-dark-desaturated-blue' : 'bg-white'} ${done ? 'bg-gradient-to-t from-check-background-color-1 to-check-background-color-2' : ''} rounded-full p-2`}
                                onClick={() => handleSetCompleted(id)}
                            >
                                <img
                                    src={check}
                                    alt="icon check"
                                    className={`w-2.5 ${done ? 'block' : 'hidden'}`}
                                />
                            </div>
                        </div>
                        <p
                            ref={setNodeRef}
                            {...attributes}
                            {...listeners}
                            style={style}
                            className={`${darkmode ? 'text-light-grayish-blue' : 'text-very-dark-grayish-blue'} ${done ? 'line-through decoration-very-light-grayish-blue text-very-light-grayish-blue' : ''} text-xl`}>{text}
                        </p>
                    </div>
                </li>
                <img
                    src={cross}
                    alt="cross icon"
                    className={`close cursor-pointer ${darkmode ? 'md:opacity-0 md:transition-opacity duration-200' : ''}`}
                    onClick={openModal}
                />
            </div>

            {/* MODAL */}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${darkmode ? 'bg-very-dark-desaturated-blue' : 'bg-white'} p-6 text-left align-middle shadow-xl transition-all`}>
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-lg font-medium leading-6 ${darkmode ? 'text-light-grayish-blue' : 'text-gray-900'}`}
                                    >
                                        Delete TODO
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            <span className='text-red-400'>Do you want to delete this todo?</span> this action cannot be reversed
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-5 justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={handleEliminarItem}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    )
}

export default ListItem