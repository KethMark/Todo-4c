This is not just a TODO application, It's a high quality TODO application.

## Cloning

In your terminal, run this following

``
git clone https://github.com/KethMark/Todo-4c.git

``
cd Todo-4c

``
code .


## Installation

Open your terminal, run this following

`` 
npm install

``
Create your .env file, and paste your

``
DATABASE_URL='postgresql://neondb_owner:.......'

``
Note: You can use any database what you prefer but for this one I use postgress from Neon database.

Open another terminal, run your application

`` 
npm run dev

``
Open the localhost 

``
http://localhost:3000/

``
Congrats 🎉👋

## Library, Framwork, Tools and more

• Nextjs 16

• Tanstack query

• Shadcn Ui

• Axios

• Drizzle

• Tabler/icons-react

• Zod

• Typescript

## Implementation 🎯

— Backend 

You can locate the backend implementation within the folder of app inside api where route.ts (GET, POST) and folder id where route.ts (UPDATE, DELETE)

— Frontend

By default, inside the level of app where the page.tsx render the table and call the function inside the /components/todo.tsx

navigate into /components/table/data-table.tsx you can find the mutation render where the update data and mark as completed happened

next in /components/table/column I handle the action, also the delete mutation and call the function inside the  /components/table/data-table-row-actions.tsx

and lastly the creation data happened render inside the /component/table/data-table where the DataTableToolbar function and call the function inside the /components/table/data-table-toolbar.tsx and you can find the AddTodo render the function
