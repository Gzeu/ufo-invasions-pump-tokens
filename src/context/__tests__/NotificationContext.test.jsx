import React from "react";
import { render, screen } from "@testing-library/react";
import { NotificationProvider, useNotifications } from "../../context/NotificationContext";

function Demo() {
  const { showSuccess } = useNotifications();
  React.useEffect(() => {
    showSuccess("Hello world", { duration: 500 });
  }, [showSuccess]);
  return <div>Demo</div>;
}

test("notification show and auto-dismiss", async () => {
  render(
    <NotificationProvider>
      <Demo />
    </NotificationProvider>
  );
  expect(await screen.findByText(/Hello world/i)).toBeInTheDocument();
});