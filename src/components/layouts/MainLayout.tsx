
import * as React from "react";
import { Outlet } from "react-router-dom";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      {children || <Outlet />}
    </div>
  );
};
