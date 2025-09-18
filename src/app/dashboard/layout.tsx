import { ReactNode } from "react";

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
}
