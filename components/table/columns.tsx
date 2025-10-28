"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableMeta } from "./data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoSchema } from "../todo";
import { Gender } from "@/lib/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<TodoSchema>[] = [
  {
    id: "completed",
    header: "Done",
    cell: ({ row, table }) => {
      const meta = table.options.meta as DataTableMeta<TodoSchema>;

      return (
        <Checkbox
          checked={row.original.completed}
          onCheckedChange={() => meta.onToggleComplete(row)}
          aria-label="Mark as complete"
          className="translate-y-0.5"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<TodoSchema>;
      const isEditing = meta.editingRowId === row.id;

      const completedClass =
        row.original.completed && !isEditing
          ? "line-through decoration-dashed"
          : "";

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.name ?? row.getValue("name")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span className={completedClass}>{row.getValue("name")}</span>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<TodoSchema>;
      const isEditing = meta.editingRowId === row.id;

      if (isEditing) {
        return (
          <Select
            value={meta.editedRowData[row.id]?.gender ?? row.getValue("gender")}
            onValueChange={(value) =>
              meta.updateEditedRowData(row.id, column.id, value)
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      const gender = Gender.find(
        (gender) => gender.value === row.getValue("gender")
      );

      if (!gender) {
        return null;
      }

      const completedClass =
        row.original.completed && !isEditing
          ? "line-through decoration-dashed"
          : "";

      return (
        <div className="flex w-[100px] items-center gap-2">
          {gender.icon && (
            <gender.icon className="text-muted-foreground size-4" />
          )}
          <span className={completedClass}>{row.getValue("gender")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<TodoSchema>;
      const isEditing = meta.editingRowId === row.id;

      const completedClass =
        row.original.completed && !isEditing
          ? "line-through decoration-dashed"
          : "";

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.email ?? row.getValue("email")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span className={completedClass}>{row.getValue("email")}</span>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<TodoSchema>;
      const isEditing = meta.editingRowId === row.id;

      const completedClass =
        row.original.completed && !isEditing
          ? "line-through decoration-dashed"
          : "";

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.age ?? row.getValue("age")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span className={completedClass}>{row.getValue("age")}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
