import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { AppTemplate } from './components/templates/AppTemplate';
import {
  AuthPage,
  StudioPage,
  AgentsPage,
  WorkflowsPage,
} from './pages';
import { Spinner } from './components/atoms';

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
        persistor={persistor}
      >
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Authentication route */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppTemplate />
                  </ProtectedRoute>
                }
              >
                {/* Default redirect to studio */}
                <Route index element={<Navigate to="/studio" replace />} />

                {/* Main application routes */}
                <Route path="studio" element={<StudioPage />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="workflows" element={<WorkflowsPage />} />
              </Route>

              {/* Catch all route - redirect to studio */}
              <Route path="*" element={<Navigate to="/studio" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
