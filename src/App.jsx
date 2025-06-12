import React from 'react';
import { Playground } from './components/component/playground';
import Apology from './components/component/apology';
import { ThemeProvider } from './components/theme-provider';

// check if device is desktop or not
const isDesktop = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|tablet|touch|samsung|fridge/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 1024;
    return !isMobile && !isSmallScreen;
};

function App() {
    const [isDesktopDevice, setIsDesktopDevice] = React.useState(null);

    React.useEffect(() => {
        setIsDesktopDevice(isDesktop());
    }, []);
    if (isDesktopDevice === true) {
        return (
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Playground />
            </ThemeProvider>
        )
    }
    else {
        return (
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Apology />
            </ThemeProvider>
        )
    }
}

export default App
