import React from 'react';
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PollCreatorPage, VotePage } from "./pages";
import { Routes } from "./routes";


function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Switch>
                    <Route path={Routes.index} exact>
                        <PollCreatorPage/>
                    </Route>
                    <Route path={Routes.vote}>
                        <VotePage/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </Layout>
    )
}

export default App;
