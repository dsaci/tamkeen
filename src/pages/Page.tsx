import { useState, useEffect } from 'react'
import supabase from '../utils/supabase'

function Page() {
    const [todos, setTodos] = useState<any[]>([])

    useEffect(() => {
        async function getTodos() {
            const { data: todos } = await supabase.from('todos').select()

            if (todos && todos.length > 0) {
                setTodos(todos)
            }
        }

        getTodos()
    }, [])

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Todos</h1>
            <ul className="list-disc pl-5">
                {todos.map((todo) => (
                    <li key={todo.id || JSON.stringify(todo)}>
                        {typeof todo === 'object' ? JSON.stringify(todo) : todo}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Page
