import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Table = forwardRef(function Table({ className, ...props }, ref) {
  return (
    <table
      ref={ref}
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
});

const TableHeader = forwardRef(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={cn("[&_tr]:border-b-0", className)} {...props} />;
});

const TableBody = forwardRef(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn("", className)} {...props} />;
});

const TableFooter = forwardRef(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn("bg-secondary font-medium", className)}
      {...props}
    />
  );
});

const TableHead = forwardRef(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});

const TableRow = forwardRef(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border transition-colors hover:bg-secondary/50",
        className
      )}
      {...props}
    />
  );
});

const TableCell = forwardRef(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn("px-4 py-3", className)}
      {...props}
    />
  );
});

const TableCaption = forwardRef(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn("mt-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
export default Table;
