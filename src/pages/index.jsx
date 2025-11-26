import Layout from "./Layout.jsx";
import MemoryMap from "./MemoryMap";
import LandingPage from "./LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

export default function Pages() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                    path="/app" 
                    element={
                        <Layout currentPageName={"MemoryMap"}>
                            <MemoryMap />
                        </Layout>
                    } 
                />
                <Route path="/MemoryMap" element={<Navigate to="/app" />} />
            </Routes>
        </Router>
    );
}