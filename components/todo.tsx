"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { Spinner } from "./ui/spinner";
import { TodoSchema } from "@/lib/todoSchema";

export const Todo = () => {
  //handle fetch request query (Get)
  const { data, isLoading } = useQuery({
    queryKey: ["Todo"],
    queryFn: async (): Promise<TodoSchema[]> => {
      const res = await axios.get("/api/todo").then((res) => res.data);
      return res;
    },
  });

  return (
    <div className="flex flex-col space-y-5">
      <h1 className="text-4xl">Todo List</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(80vh-10rem)]">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>{data && <DataTable columns={columns} data={data} />}</>
      )}
    </div>
  );
};
