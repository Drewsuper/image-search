import ThemeContextProvider from "./contexts/ThemeContext";
import RouterComponent from "./router/router";

function App() {
  return (
    <ThemeContextProvider>
      <RouterComponent />
    </ThemeContextProvider>
  );
}

export default App;
