import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AttendanceForm from './components/AttendanceForm';
import StudentRegistration from './components/StudentRegistration';
import StudentList from './components/StudentList';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/attendance" component={AttendanceForm} />
                <Route path="/register" component={StudentRegistration} />
                <Route path="/students" component={StudentList} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default App;