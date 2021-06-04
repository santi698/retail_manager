import { Tr, Td, Skeleton } from "@chakra-ui/react";

export interface TableRowsSkeletonProps {
  rows: number;
  columns: number;
}

export function TableRowsSkeleton({ rows, columns }: TableRowsSkeletonProps) {
  return (
    <>
      {Array.from(Array(rows)).map((_, i) => (
        <Tr key={i}>
          <Td colSpan={columns}>
            <Skeleton height="20px" />
          </Td>
        </Tr>
      ))}
    </>
  );
}
