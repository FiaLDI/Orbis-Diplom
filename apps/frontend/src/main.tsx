import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import { App } from "@/App";

import { store } from "@/app/store";
import { Provider } from "react-redux";
import "@/shared/lib/i18n";
const rootElement: HTMLElement | null = document.getElementById("root");

// Создайте корень и отрендерьте приложение
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    );
}
