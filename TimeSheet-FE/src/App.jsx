import AppRoute from "./routers/AppRoute";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AppRoute />
    </LocalizationProvider>
  );
}

export default App;
