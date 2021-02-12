import React from 'react';
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PollCreatorPage } from "./pages";
import { VotePage } from "./pages/VotePage/VotePage";


function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <PollCreatorPage/>
                    </Route>
                    <Route path="/vote">
                        <VotePage/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </Layout>
    )
}

export default App;
