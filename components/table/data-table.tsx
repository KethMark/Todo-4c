"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios, { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { TodoSchema } from "@/lib/todoSchema";

export interface DataTableMeta<TData> {
  editingRowId: string | null;
  setEditingRowId: (id: string | null) => void;
  onEdit: (row: Row<TData>) => void;
  onCancel: (rowId: string) => void;
  onSave: (row: Row<TData>) => void;
  updateEditedRowData: (rowId: string, columnId: string, value: string) => void;
  editedRowData: Record<string, Partial<TData>>;
  onToggleComplete: (row: Row<TData>) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends TodoSchema, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editedRowData, setEditedRowData] = React.useState<
    Record<string, Partial<TData>>
  >({});

  const queryClient = useQueryClient();

  //handle update and mark as complete mutation (update and completed)
  const { mutateAsync } = useMutation({
    mutationKey: ["TodoList"],
    mutationFn: async (data: TodoSchema) => {
      try {
        const res = await axios
          .put(`/api/todo/${data.id}`, data)
          .then((res) => res.data);
        return res;
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw error.response.data; 
        }
        throw new Error("An unexpected error occurred");
      }
    },

    onMutate: async (updatedTodo: TodoSchema) => {
      await queryClient.cancelQueries({ queryKey: ["Todo"] });

      const previousTodos = queryClient.getQueryData<TodoSchema[]>(["Todo"]);

      if (previousTodos) {
        queryClient.setQueryData<TodoSchema[]>(
          ["Todo"],
          previousTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
      }

      return { previousTodos };
    },

    onError: (err, updatedTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<TodoSchema[]>(["Todo"], context.previousTodos);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Todo"] });
    },
  });

  const onEdit = React.useCallback((row: Row<TData>) => {
    setEditingRowId(row.id);
    setEditedRowData((prev) => ({
      ...prev,
      [row.id]: { ...row.original },
    }));
  }, []);

  const onCancel = React.useCallback((rowId: string) => {
    setEditingRowId(null);
    setEditedRowData((prev) => {
      const newEditedData = { ...prev };
      delete newEditedData[rowId];
      return newEditedData;
    });
  }, []);

  const onSave = React.useCallback(
    (row: Row<TData>) => {
      const updatedData = editedRowData[row.id];
      if (updatedData) {
        toast.promise(mutateAsync({ ...row.original, ...updatedData }), {
          loading: "Updating...",
          success: (data) => data.text,
          error: (data) => data.error,
        });
      }
    },
    [editedRowData, mutateAsync]
  );

  const updateEditedRowData = React.useCallback(
    (rowId: string, columnId: string, value: string) => {
      setEditedRowData((prev) => ({
        ...prev,
        [rowId]: {
          ...prev[rowId],
          [columnId]: value,
        },
      }));
    },
    []
  );

  const onToggleComplete = React.useCallback(
    (row: Row<TData>) => {
      const updatedTodo = {
        ...row.original,
        completed: !row.original.completed,
      };

      toast.promise(mutateAsync(updatedTodo), {
        loading: "Updating status...",
        success: () =>
          updatedTodo.completed
            ? "Marked as complete!"
            : "Marked as incomplete.",
        error: (data) => data.error,
      });
    },
    [mutateAsync]
  );

  const meta = React.useMemo(
    () =>
      ({
        editingRowId,
        setEditingRowId,
        editedRowData,
        onEdit,
        onCancel,
        onSave,
        updateEditedRowData,
        onToggleComplete,
      } as DataTableMeta<TData>),
    [
      editingRowId,
      setEditingRowId,
      editedRowData,
      onEdit,
      onCancel,
      onSave,
      updateEditedRowData,
      onToggleComplete,
    ]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: meta,
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
