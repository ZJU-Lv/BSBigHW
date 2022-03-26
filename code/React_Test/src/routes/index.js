import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Information from '../views/Information'
import CreateTask from '../views/CreateTask'
import CreateVideoTask from '../views/CreateVideoTask'
import TaskList from '../views/TaskList'
import SeeTask from '../views/SeeTask'
import MyTask from '../views/MyTask'
import PictureMarker from '../views/PictureMarker'
import PictureMarkerX from '../views/PictureMarkerX'
import SeeTaskResult from '../views/SeeTaskResult'
import SeeTaskResultX from '../views/SeeTaskResultX'
import MyCreateTask from '../views/MyCreateTask'

const CRouter = () => {
    
    return (
        <Switch>
            <Route path='/user/information' component={Information}></Route>
            <Route path='/user/createTask' component={CreateTask}></Route>
            <Route path='/user/createVideoTask' component={CreateVideoTask}></Route>
            <Route path='/user/taskList' component={TaskList}></Route>
            <Route path='/user/seeTask' component={SeeTask}></Route>
            <Route path='/user/myTask' component={MyTask}></Route>
            <Route path='/user/myCreateTask' component={MyCreateTask}></Route>
            <Route path='/user/pictureMarker' component={PictureMarker}></Route>
            <Route path='/user/pictureMarkerX' component={PictureMarkerX}></Route>
            <Route path='/user/seeTaskResult' component={SeeTaskResult}></Route>
            <Route path='/user/seeTaskResultX' component={SeeTaskResultX}></Route>
        </Switch>
    );
};

export default CRouter;
