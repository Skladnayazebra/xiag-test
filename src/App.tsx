import React from 'react';
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PollCreatorPage, VotePage } from "./pages";


function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <PollCreatorPage/>
                    </Route>
                    <Route path="/vote/:pollId" children={({ match }) => (
                        <VotePage params={match ? match.params : {}}/>
                    )}/>
                </Switch>
            </BrowserRouter>
        </Layout>
    )
}

export default App;
