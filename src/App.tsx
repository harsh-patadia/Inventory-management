import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import AdminRouter from './admin/router/AdminRouter';
import { theme } from './utils/theme';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary[500],
    },
    secondary: {
      main: theme.colors.secondary[500],
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;