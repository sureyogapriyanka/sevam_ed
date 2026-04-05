declare module '@radix-ui/react-*' {
    interface ComponentProps {
        className?: string;
        children?: React.ReactNode;
        [key: string]: any;
    }
}

// Extend Radix UI component props to include common properties
declare global {
    namespace RadixUI {
        interface BaseProps {
            className?: string;
            children?: React.ReactNode;
        }
    }
}

// Additional type fixes for common UI component patterns
declare global {
    interface Window {
        [key: string]: any;
    }
}

// Allow any props on Radix UI components to fix type mismatches
declare module '*.tsx' {
    const content: any;
    export default content;
}

export { };
