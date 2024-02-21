import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function AssignmentSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={250} />
    </Stack>
  );
}
